import Link from "next/link";
import { ProjectCard } from "./components/ProjectCard";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { projects } from "@/lib/projects";

export default function Home() {
  const featured = projects.filter((project) => project.featured);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero page-shell">
          <div className="home-hero__meta" data-reveal>
            <p className="section-label">Han Zhang / Vancouver, BC</p>
            <p>Computer science student<br />Former architectural designer</p>
          </div>
          <h1 data-reveal>
            <span className="home-hero__code">I design systems</span>
            <span className="home-hero__space">across code and space.</span>
          </h1>
          <div className="home-hero__footer" data-reveal>
            <p>
              A portfolio of software, architecture and visual research — connected by an interest in
              structure, interaction and how people inhabit systems.
            </p>
            <Link className="text-link" href="/work">Explore all work <span>↘</span></Link>
          </div>
        </section>

        <section className="discipline-strip" aria-label="Portfolio disciplines">
          <span>01 Software</span>
          <span>02 Architecture Practice</span>
          <span>03 Academic Research</span>
          <span>04 Visual Studies</span>
        </section>

        <section className="selected-work page-shell">
          <div className="section-heading" data-reveal>
            <p className="section-label">Selected work / 01–06</p>
            <h2>Projects with a point of view.</h2>
            <p>
              Each project has its own page: context, process, system, outcome and an honest account of my role.
            </p>
          </div>
          <div className="project-grid project-grid--featured">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <div className="section-cta" data-reveal>
            <p>{projects.length} projects currently published</p>
            <Link className="button-link" href="/work">View the full index <span>↗</span></Link>
          </div>
        </section>

        <section className="home-about page-shell">
          <p className="section-label" data-reveal>Profile / Two disciplines, one practice</p>
          <div className="home-about__grid">
            <h2 data-reveal>Architecture taught me to see systems. Computer science taught me to make them run.</h2>
            <div data-reveal>
              <p>
                I am pursuing a Bachelor of Computer Science at the University of British Columbia after
                studying architecture and working in architectural design. Across both fields, I care about
                clear structure, useful detail and the experience of the person on the other side of the work.
              </p>
              <Link className="text-link" href="/about">Read the full profile <span>↗</span></Link>
            </div>
          </div>
        </section>

        <section className="home-contact page-shell" data-reveal>
          <p className="section-label">Contact / Vancouver</p>
          <a href="mailto:hanz14c@gmail.com">Have a project or conversation in mind?</a>
          <p>hanz14c@gmail.com</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
