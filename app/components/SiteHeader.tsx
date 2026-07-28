import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="wordmark" href="/" aria-label="Han Zhang home">
          HZ<span aria-hidden="true">/</span>PORTFOLIO
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <a href="https://github.com/HanZ14c" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/work">Work</Link>
            <Link href="/about">About</Link>
            <a href="https://github.com/HanZ14c" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
