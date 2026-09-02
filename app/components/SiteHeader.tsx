"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PortfolioGuide } from "./PortfolioGuide";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isWork = pathname === "/work" || pathname.startsWith("/work/");
  const isAbout = pathname === "/about";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href="/" aria-label="Han Zhang home" aria-current={isHome ? "page" : undefined}>
          HZ<span aria-hidden="true">/</span>PORTFOLIO
        </Link>
        <div className="site-header__actions">
          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link href="/work" aria-current={isWork ? "page" : undefined}>Work</Link>
            <Link href="/about" aria-current={isAbout ? "page" : undefined}>About</Link>
            <a href="/Han-Zhang-Resume.pdf" target="_blank" rel="noreferrer">
              Résumé <span className="link-arrow" aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/HanZ14c" target="_blank" rel="noreferrer">
              GitHub <span className="link-arrow" aria-hidden="true">↗</span>
            </a>
          </nav>
          <PortfolioGuide />
          <div className="mobile-nav">
            <button
              className="mobile-nav__toggle"
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
            {isMenuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation">
              <Link href="/work" aria-current={isWork ? "page" : undefined} onClick={() => setIsMenuOpen(false)}>Work</Link>
              <Link href="/about" aria-current={isAbout ? "page" : undefined} onClick={() => setIsMenuOpen(false)}>About</Link>
              <a href="/Han-Zhang-Resume.pdf" target="_blank" rel="noreferrer">
                Résumé <span className="link-arrow" aria-hidden="true">↗</span>
              </a>
              <a href="https://github.com/HanZ14c" target="_blank" rel="noreferrer">
                GitHub <span className="link-arrow" aria-hidden="true">↗</span>
              </a>
            </nav>}
          </div>
        </div>
      </div>
    </header>
  );
}
