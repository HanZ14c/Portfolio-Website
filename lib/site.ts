export const siteConfig = {
  name: "Han Zhang",
  title: "Han Zhang — Computer Science, Architecture and Visual Work",
  description:
    "The interdisciplinary portfolio of Han Zhang: computer science, architectural practice, academic design and visual studies.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.hanz14c.workers.dev",
  email: "hanz14c@gmail.com",
  github: "https://github.com/HanZ14c",
  linkedin: "https://www.linkedin.com/in/hanz14c/",
  location: "Vancouver, BC, Canada",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
