import type { Metadata } from "next";
import { ProjectIndex } from "./ProjectIndex";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Work",
  description: "Software, architecture and visual work by Han Zhang.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="page-shell index-page">
        <header className="index-hero" data-reveal>
          <p className="section-label">Complete project index</p>
          <h1>Work</h1>
          <p>
            Software systems, professional practice, academic architecture and visual studies — every
            project opens into its own detailed page.
          </p>
        </header>
        <ProjectIndex />
      </main>
      <SiteFooter />
    </>
  );
}
