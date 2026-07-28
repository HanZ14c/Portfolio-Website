import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="section-label">Han Zhang / Portfolio</p>
        <p className="footer-statement">Let&apos;s build something thoughtful.</p>
      </div>
      <div className="footer-links">
        <a href="mailto:hanz14c@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/hanz14c/" target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a href="https://github.com/HanZ14c" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <Link href="/about">About</Link>
      </div>
      <p className="footer-note">Computer science × architecture × visual storytelling</p>
    </footer>
  );
}
