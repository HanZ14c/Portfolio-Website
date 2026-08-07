import type { Metadata } from "next";
import { CloudflareAnalytics } from "./components/CloudflareAnalytics";
import { ClientEffects } from "./components/ClientEffects";
import { PortfolioGuide } from "./components/PortfolioGuide";
import { serializeJsonLd, siteConfig } from "@/lib/site";
import "./styles/tokens.css";
import "./globals.css";
import "./styles/accessibility.css";
import "./styles/portfolio-guide.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s — Han Zhang",
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "Han Zhang",
    "computer science portfolio",
    "architecture portfolio",
    "software projects",
    "architectural design",
    "visual studies",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Han Zhang portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    homeLocation: {
      "@type": "Place",
      name: siteConfig.location,
    },
    sameAs: [siteConfig.github, siteConfig.linkedin],
    knowsAbout: ["Computer Science", "Software Development", "Architecture", "Visual Communication"],
  };

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
        <ClientEffects />
        {children}
        <PortfolioGuide />
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
