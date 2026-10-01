import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ProjectCard } from "@/app/components/ProjectCard";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getProject, getProjectNeighbors, getRelatedProjects, publicProjects } from "@/lib/projects";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return publicProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: project.title,
      description: project.excerpt,
      images: [project.cover ?? "/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.excerpt,
      images: [project.cover ?? "/og.png"],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);
  const neighbors = getProjectNeighbors(project);
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.excerpt,
    url: absoluteUrl(`/work/${project.slug}`),
    image: absoluteUrl(project.cover ?? "/og.png"),
    dateCreated: project.time,
    genre: project.category,
    creator: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    sameAs: project.links?.map((link) => link.href),
  };

  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="project-page"
        style={{
          "--project-accent": project.accent,
          "--code-card": project.codeAccent,
        } as CSSProperties}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(projectJsonLd) }}
        />
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

            {project.highlights && project.highlights.length > 0 && (
              <section className="project-sections page-shell" aria-label="Project highlights">
                <div className="project-section" data-reveal>
                  <p className="section-label">Highlights</p>
                  <div>
                    <h2>Project highlights</h2>
                    <ul>{project.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}</ul>
                  </div>
                </div>
              </section>
            )}

            <section className="project-facts page-shell" aria-label="Project facts">
              {project.facts.map((fact) => (
                <div key={fact.label} data-reveal>
                  <span>{fact.label}</span>
                  <p>{fact.value}</p>
                </div>
              ))}
            </section>

            {project.showSections && project.sections.length > 0 && (
              <div className="project-sections page-shell">
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
            )}
          </>
        )}

        {project.gallery && project.showGallery !== false && (
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

        <nav className="project-pagination page-shell" aria-label="Browse adjacent projects">
          {neighbors.previous && (
            <Link className="project-pagination__link is-previous" href={`/work/${neighbors.previous.slug}`}>
              <span className="project-pagination__direction">← Previous project</span>
              <strong>{neighbors.previous.title}</strong>
              <small>{neighbors.previous.category} · {neighbors.previous.time}</small>
            </Link>
          )}
          <p className="project-pagination__position">
            {String(neighbors.position).padStart(2, "0")} / {String(neighbors.total).padStart(2, "0")}
          </p>
          {neighbors.next && (
            <Link className="project-pagination__link is-next" href={`/work/${neighbors.next.slug}`}>
              <span className="project-pagination__direction">Next project →</span>
              <strong>{neighbors.next.title}</strong>
              <small>{neighbors.next.category} · {neighbors.next.time}</small>
            </Link>
          )}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
