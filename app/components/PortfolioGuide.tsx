"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  links?: Array<{ label: string; href: string }>;
};

type ChatResponse = {
  answer: string;
  links: Array<{ label: string; href: string }>;
  mode: "guide" | "ai";
};

const starterMessage: Message = {
  id: 0,
  role: "assistant",
  content: "Explore Han's work across computer science, architecture and visual studies.",
};

const suggestions = [
  "Find projects relevant to a software role",
  "Explain the transition from architecture to CS",
  "Show projects involving Java or databases",
];

export function PortfolioGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMode, setResponseMode] = useState<"guide" | "ai">("guide");
  const inputId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(1);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const userMessage: Message = {
      id: nextMessageId.current++,
      role: "user",
      content: trimmedQuestion,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/portfolio-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-8).map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) throw new Error(`Chat request failed with ${response.status}`);
      const result = await response.json() as ChatResponse;
      setResponseMode(result.mode);
      setMessages((current) => [...current, {
        id: nextMessageId.current++,
        role: "assistant",
        content: result.answer,
        links: result.links,
      }]);
    } catch {
      setMessages((current) => [...current, {
        id: nextMessageId.current++,
        role: "assistant",
        content: "The guide is temporarily unavailable. You can continue through the project index or contact Han directly.",
        links: [{ label: "Browse all work", href: "/work" }],
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const resetConversation = () => {
    setMessages([starterMessage]);
    setResponseMode("guide");
    setInput("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <aside className={`portfolio-guide${isOpen ? " is-open" : ""}`}>
      {isOpen && (
        <section
          className="portfolio-guide__panel"
          role="dialog"
          aria-label="Portfolio guide"
          aria-describedby={`${inputId}-description`}
        >
          <header className="portfolio-guide__header">
            <div>
              <span aria-hidden="true" />
              <p>Portfolio Guide</p>
              <small>{responseMode === "ai" ? "AI-assisted · site content only" : "Site content only"}</small>
            </div>
            <div className="portfolio-guide__header-actions">
              <button type="button" onClick={resetConversation} aria-label="Reset conversation">↺</button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close portfolio guide">×</button>
            </div>
          </header>

          <div className="portfolio-guide__messages" aria-live="polite" aria-busy={isLoading}>
            {messages.map((message) => (
              <article className={`portfolio-guide__message is-${message.role}`} key={message.id}>
                <p>{message.content}</p>
                {message.links && message.links.length > 0 && (
                  <div className="portfolio-guide__links">
                    {message.links.map((link) => (
                      <a
                        href={link.href}
                        key={`${message.id}-${link.href}`}
                        {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {messages.length === 1 && (
              <div className="portfolio-guide__suggestions" aria-label="Suggested questions">
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => void sendMessage(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="portfolio-guide__thinking" aria-label="Portfolio guide is responding">
                <span /><span /><span />
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="portfolio-guide__form" onSubmit={submit}>
            <label className="sr-only" htmlFor={inputId}>Ask about Han&apos;s portfolio</label>
            <textarea
              ref={inputRef}
              id={inputId}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              maxLength={500}
              rows={1}
              placeholder="Ask about projects, skills or background…"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || input.trim().length === 0} aria-label="Send message">
              ↑
            </button>
          </form>
          <p className="portfolio-guide__notice" id={`${inputId}-description`}>
            Portfolio information only. Responses may be incomplete.
          </p>
        </section>
      )}

      <button
        ref={launcherRef}
        className="portfolio-guide__launcher"
        type="button"
        aria-label={isOpen ? "Close portfolio guide" : "Ask about Han's work"}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="portfolio-guide__launcher-mark" aria-hidden="true">{isOpen ? "×" : "?"}</span>
        <span className="portfolio-guide__launcher-label">Ask about my work</span>
      </button>
    </aside>
  );
}
