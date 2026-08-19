import Link from "next/link";
import { HomeScrollCue } from "./components/HomeScrollCue";
import { InstitutionName } from "./components/InstitutionName";
import { ProjectCard } from "./components/ProjectCard";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { getFeaturedProjects } from "@/lib/featured-projects";
import { projects } from "@/lib/projects";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="home-page">
        <section className="home-hero page-shell">
          <div className="home-hero__meta" data-reveal>
            <p className="section-label">Han Zhang / Vancouver, BC</p>
            <p>Computer science student<br />Former architectural designer</p>
          </div>
          <h1 data-reveal>
            A portfolio of{" "}
            <span>code, space, and visual studies.</span>
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
          <span>01 Computer Science</span>
          <span>02 Architecture Practice</span>
          <span>03 Academic Research</span>
          <span>04 Visual Studies</span>
        </section>

        <section className="selected-work page-shell">
          <div className="section-heading" data-reveal>
            <p className="section-label">Selected work / 01–09</p>
            <h2>Projects with a point of view.</h2>
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
            <h2 data-reveal>Working between architecture and computer science.</h2>
            <div data-reveal>
              <p>
                I am pursuing a Bachelor of Computer Science at the{" "}
                <InstitutionName logo="/media/institutions/ubc.jpeg" compact>
                  University of British Columbia
                </InstitutionName>{" "}
                after studying architecture and working in architectural design. Across both fields, I care
                about clear structure, useful detail and the experience of the person on the other side of the
                work.
              </p>
              <Link className="text-link" href="/about">Read the full profile <span>↗</span></Link>
              <nav className="profile-links" aria-label="Profile links">
                <a href="mailto:hanz14c@gmail.com">
                  <img src="/media/social/email.png" alt="" aria-hidden="true" />
                  Email <span className="link-arrow" aria-hidden="true">↗</span>
                </a>
                <a href="https://www.linkedin.com/in/hanz14c/" target="_blank" rel="noreferrer">
                  <img src="/media/social/linkedin.png" alt="" aria-hidden="true" />
                  LinkedIn <span className="link-arrow" aria-hidden="true">↗</span>
                </a>
                <a href="https://github.com/HanZ14c" target="_blank" rel="noreferrer">
                  <img src="/media/social/github.png" alt="" aria-hidden="true" />
                  GitHub <span className="link-arrow" aria-hidden="true">↗</span>
                </a>
              </nav>
            </div>
          </div>

          <div className="home-about__details" data-reveal>
            <p className="section-label">Background + capabilities</p>
            <div>
              <div className="home-about__timeline" aria-label="Selected background">
                <article>
                  <span>2025 — Expected 2028</span>
                  <h3>Computer Science</h3>
                  <p>
                    <InstitutionName logo="/media/institutions/ubc.jpeg">
                      University of British Columbia
                    </InstitutionName>
                  </p>
                </article>
                <article>
                  <span>2023 — 2025</span>
                  <h3>Computer Studies</h3>
                  <p>
                    <InstitutionName logo="/media/institutions/langara.jpeg">
                      Langara College
                    </InstitutionName>
                  </p>
                </article>
                <article>
                  <span>2017 — 2020</span>
                  <h3>Architectural Practice</h3>
                  <p>
                    <InstitutionName logo="/media/institutions/huayi.jpeg">
                      Hong Kong Huayi Design Consultant
                    </InstitutionName>
                  </p>
                </article>
                <article>
                  <span>2013 — 2018</span>
                  <h3>Architecture</h3>
                  <p>
                    <InstitutionName logo="/media/institutions/xaut.jpeg">
                      Xi&apos;an University of Technology
                    </InstitutionName>
                  </p>
                </article>
              </div>

              <div className="home-about__capabilities" aria-label="Selected capabilities">
                <article>
                  <h3>Software</h3>
                  <p>Java · JavaScript · Python · C · C++</p>
                </article>
                <article>
                  <h3>Web + Data</h3>
                  <p>React · HTML/CSS · SQL · Relational modelling</p>
                </article>
                <article>
                  <h3>Architecture + Visual</h3>
                  <p>AutoCAD · Rhino · SketchUp · Adobe · Figma</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="home-contact page-shell" data-reveal>
          <p className="section-label">Contact / Vancouver</p>
          <a href="mailto:hanz14c@gmail.com">Have a project or conversation in mind?</a>
          <p>hanz14c@gmail.com</p>
        </section>
        <HomeScrollCue />
      </main>
      <SiteFooter />
    </>
  );
}
