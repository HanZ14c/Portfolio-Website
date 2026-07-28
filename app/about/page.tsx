import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience and working approach of Han Zhang.",
};

const timeline = [
  {
    period: "2025 — Expected 2028",
    title: "Bachelor of Computer Science",
    place: "University of British Columbia",
  },
  {
    period: "2023 — 2025",
    title: "Computer Studies",
    place: "Langara College",
  },
  {
    period: "2017 — 2020",
    title: "Architectural practice",
    place: "Hong Kong Huayi Design Consultant (Shenzhen)",
  },
  {
    period: "2013 — 2018",
    title: "Bachelor of Engineering in Architecture",
    place: "Xi'an University of Technology",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell about-page">
        <header className="about-hero">
          <p className="section-label" data-reveal>About / Han Zhang</p>
          <h1 data-reveal>A builder of digital and spatial systems.</h1>
          <p className="about-hero__lead" data-reveal>
            I am a computer science student at UBC and a former architectural designer. My work moves
            between application logic, databases, interfaces, buildings, public space and visual narrative.
          </p>
        </header>

        <section className="about-statement" data-reveal>
          <p className="section-label">Working approach</p>
          <div>
            <p>
              Architecture trained me to move between a city-scale idea and a construction detail. Software
              asks for the same kind of thinking: understand the whole system, define relationships, then make
              each part reliable enough to support the experience.
            </p>
            <p>
              I value legible structure, patient iteration and visual communication. I am especially interested
              in work where technical decisions and human experience cannot be separated.
            </p>
          </div>
        </section>

        <section className="timeline-section">
          <div className="section-heading" data-reveal>
            <p className="section-label">Education + Experience</p>
            <h2>A path across disciplines.</h2>
          </div>
          <div className="timeline">
            {timeline.map((item, index) => (
              <article key={item.period} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item.period}</p>
                <h3>{item.title}</h3>
                <p>{item.place}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="skills-section">
          <p className="section-label" data-reveal>Capabilities</p>
          <div className="skills-grid">
            <article data-reveal>
              <h2>Software</h2>
              <p>Java, C, C++, JavaScript, Python, SQL</p>
              <p>JavaFX, Swing, JUnit, Git, TCP sockets</p>
            </article>
            <article data-reveal>
              <h2>Web + Data</h2>
              <p>HTML, CSS, JavaScript, PHP</p>
              <p>MySQL, SQL Server, relational modelling</p>
            </article>
            <article data-reveal>
              <h2>Design</h2>
              <p>Adobe Creative Suite, Figma</p>
              <p>AutoCAD, SketchUp, Rhino, Lumion</p>
            </article>
          </div>
        </section>

        <section className="about-links" data-reveal>
          <p className="section-label">Continue</p>
          <Link href="/work">View all work <span>↗</span></Link>
          <a href="mailto:hanz14c@gmail.com">Start a conversation <span>↗</span></a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
