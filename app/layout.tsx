import type { Metadata } from "next";
import { headers } from "next/headers";
import { ClientEffects } from "./components/ClientEffects";
import "./globals.css";

const siteTitle = "Han Zhang — Software, Architecture and Visual Work";
const siteDescription =
  "The interdisciplinary portfolio of Han Zhang: software systems, architectural practice, academic design and visual studies.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = host ? `${protocol}://${host}` : undefined;
  const socialImage = origin ? `${origin}/og.png` : undefined;

  return {
    ...(origin ? { metadataBase: new URL(origin) } : {}),
    title: {
      default: siteTitle,
      template: "%s — Han Zhang",
    },
    description: siteDescription,
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      title: siteTitle,
      description: siteDescription,
      images: socialImage
        ? [{ url: socialImage, width: 1734, height: 907, alt: "Han Zhang — Code × Space" }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: socialImage ? [socialImage] : [],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClientEffects />
        {children}
      </body>
    </html>
  );
}
