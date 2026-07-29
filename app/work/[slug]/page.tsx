import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ProjectCard } from "@/app/components/ProjectCard";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getProject, getRelatedProjects, projects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const projectSectionsEnabled = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.excerpt,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);

  return (
    <>
      <SiteHeader />
      <main
        className="project-page"
        style={{
          "--project-accent": project.accent,
          "--code-card": project.codeAccent,
        } as CSSProperties}
      >
        <header className="project-hero page-shell">
          <div className="project-hero__top" data-reveal>
            <Link href="/work" className="back-link">← All work</Link>
            <p>{project.category}</p>
          </div>
          <h1 data-reveal>{project.title}</h1>
          {!project.visualOnly && <p className="project-subtitle" data-reveal>{project.subtitle}</p>}
          <div className="project-hero__meta" data-reveal>
            <div><span>Period</span><p>{project.period}</p></div>
            {project.location && <div><span>Location</span><p>{project.location}</p></div>}
            <div><span>Role</span><p>{project.role}</p></div>
            <div><span>Status</span><p>{project.status}</p></div>
          </div>
        </header>

        {!project.visualOnly && (
          <section className={`project-cover ${project.containCover ? "is-contained" : ""}`} data-reveal>
            {project.cover ? (
              <img src={project.cover} alt={project.coverAlt ?? ""} />
            ) : (
              <div className="project-cover__code" aria-hidden="true">
                <span>{project.title}</span>
                <i />
                <i />
                <i />
                <i />
              </div>
            )}
          </section>
        )}

        {!project.visualOnly && (
          <>
            <section className="project-intro page-shell" data-reveal>
              <p className="section-label">Project premise</p>
              <h2>{project.statement}</h2>
              <p>{project.excerpt}</p>
              {project.links && (
                <div className="project-links">
                  {project.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label} <span>↗</span>
                    </a>
                  ))}
                </div>
              )}
            </section>

            <section className="project-facts page-shell" aria-label="Project facts">
              {project.facts.map((fact) => (
                <div key={fact.label} data-reveal>
                  <span>{fact.label}</span>
                  <p>{fact.value}</p>
                </div>
              ))}
            </section>

            <div className="project-sections page-shell" hidden={!projectSectionsEnabled}>
              {project.sections.map((section) => (
                <section key={section.label} className="project-section" data-reveal>
                  <p className="section-label">{section.label}</p>
                  <div>
                    <h2>{section.title}</h2>
                    {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.points && (
                      <ul>
                        {section.points.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        {project.gallery && (
          <section className={`project-gallery page-shell${project.visualOnly ? " project-gallery--visual-only" : ""}`}>
            {!project.visualOnly && <div className="section-heading" data-reveal>
              <p className="section-label">{project.galleryLabel ?? "Selected project material"}</p>
              <h2>{project.galleryTitle ?? "Drawings, systems and outcomes."}</h2>
            </div>}
            {project.galleryLayout === "process-triptych" ? (
              <>
                <div className="project-gallery__triptych">
                  {project.gallery.slice(0, 3).map((image) => (
                    <figure key={image.src} data-reveal>
                      <img src={image.src} alt={image.alt} loading="lazy" />
                      {image.caption && <figcaption>{image.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
                {project.gallery.slice(3).map((image) => (
                  <figure key={image.src} data-reveal>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                ))}
              </>
            ) : project.gallery.map((image) => (
              <figure key={image.src} data-reveal>
                <img src={image.src} alt={image.alt} loading="lazy" />
                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </section>
        )}

        {!project.visualOnly && related.length > 0 && (
          <section className="related-work page-shell">
            <div className="section-heading" data-reveal>
              <p className="section-label">Continue exploring</p>
              <h2>Related work</h2>
            </div>
            <div className="project-grid project-grid--related">
              {related.map((item) => <ProjectCard key={item.slug} project={item} />)}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
