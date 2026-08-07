import Link from "next/link";
import { SiteHeader } from "./components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="not-found page-shell">
        <p className="section-label">404 / Page not found</p>
        <h1>This page is outside the current drawing set.</h1>
        <Link className="button-link" href="/">Return home <span>↗</span></Link>
      </main>
    </>
  );
}
