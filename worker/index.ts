/** Cloudflare Worker entry point for the portfolio. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import {
  createPortfolioGuideReply,
  getPortfolioGuideContext,
  type GuideMessage,
} from "../lib/portfolio-guide";

type WorkersAiResult = {
  response?: string;
};

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
  AI?: {
    run(model: string, input: Record<string, unknown>): Promise<WorkersAiResult>;
  };
  PORTFOLIO_CHAT_AI_ENABLED?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const chatRateLimits = new Map<string, { count: number; resetAt: number }>();
const chatModel = "@cf/meta/llama-3.1-8b-instruct-fast";
const canonicalHostname = "zhang-han.com";
const redirectHostnames = new Set([
  "portfolio.hanz14c.workers.dev",
  "www.zhang-han.com",
]);

const permanentCanonicalRedirect = (url: URL) => {
  url.protocol = "https:";
  url.hostname = canonicalHostname;
  url.port = "";

  return new Response(null, {
    status: 308,
    headers: {
      "cache-control": "public, max-age=3600",
      location: url.toString(),
      "x-content-type-options": "nosniff",
    },
  });
};

const withSecurityHeaders = (response: Response, hostname: string) => {
  const headers = new Headers(response.headers);
  headers.set("permissions-policy", "camera=(), geolocation=(), microphone=()");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "SAMEORIGIN");

  if (hostname === canonicalHostname) {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const jsonResponse = (body: unknown, status = 200) => Response.json(body, {
  status,
  headers: {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  },
});

const isRateLimited = (request: Request) => {
  const now = Date.now();
  const key = request.headers.get("cf-connecting-ip") ?? "local";
  const current = chatRateLimits.get(key);

  if (!current || current.resetAt <= now) {
    chatRateLimits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  current.count += 1;
  return current.count > 20;
};

const readChatMessages = async (request: Request): Promise<GuideMessage[] | null> => {
  try {
    const payload = await request.json() as { messages?: unknown };
    if (!Array.isArray(payload.messages)) return null;

    const messages = payload.messages.slice(-8).filter((message): message is GuideMessage => {
      if (!message || typeof message !== "object") return false;
      const candidate = message as Partial<GuideMessage>;
      return (candidate.role === "user" || candidate.role === "assistant")
        && typeof candidate.content === "string"
        && candidate.content.trim().length > 0
        && candidate.content.length <= 500;
    });

    const totalLength = messages.reduce((total, message) => total + message.content.length, 0);
    if (messages.length === 0 || messages.at(-1)?.role !== "user" || totalLength > 3_000) return null;
    return messages;
  } catch {
    return null;
  }
};

const handlePortfolioChat = async (request: Request, env: Env) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (isRateLimited(request)) {
    return jsonResponse({ error: "Too many requests. Please try again in a minute." }, 429);
  }

  const messages = await readChatMessages(request);
  if (!messages) return jsonResponse({ error: "Invalid chat request" }, 400);

  const question = messages.at(-1)?.content ?? "";
  const guideReply = createPortfolioGuideReply(question);
  const aiEnabled = env.PORTFOLIO_CHAT_AI_ENABLED === "true" && env.AI;

  if (!aiEnabled) return jsonResponse({ ...guideReply, mode: "guide" });

  try {
    const systemMessage = [
      "You are the Portfolio Guide for Han Zhang's public portfolio.",
      "Answer only from the supplied portfolio context. Never invent projects, dates, roles, employers, personal details or availability.",
      "Be concise, factual and understated. Use the language of the visitor's question.",
      "Do not use Markdown links; the interface adds verified links separately.",
      "If the answer is absent from the context, say so and suggest contacting Han.",
      "Portfolio context:",
      getPortfolioGuideContext(),
    ].join("\n\n");

    const result = await env.AI!.run(chatModel, {
      messages: [{ role: "system", content: systemMessage }, ...messages],
      max_tokens: 380,
      temperature: 0.2,
    });
    const answer = result.response?.trim();

    if (!answer) return jsonResponse({ ...guideReply, mode: "guide" });
    return jsonResponse({ answer, links: guideReply.links, mode: "ai" });
  } catch {
    return jsonResponse({ ...guideReply, mode: "guide" });
  }
};

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (redirectHostnames.has(url.hostname)) {
      return permanentCanonicalRedirect(url);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(response, url.hostname);
    }

    if (url.pathname === "/api/portfolio-chat") {
      const response = await handlePortfolioChat(request, env);
      return withSecurityHeaders(response, url.hostname);
    }

    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(response, url.hostname);
  },
};

export default worker;
