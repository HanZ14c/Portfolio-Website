import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="project-card"
      data-size={project.cardSize ?? "standard"}
      data-reveal
      style={{ "--project-accent": project.accent } as CSSProperties}
    >
      <Link href={`/work/${project.slug}`} aria-label={`View ${project.title}`}>
        <div className={`project-card__visual ${project.containCover ? "is-contained" : ""}`}>
          {project.cover ? (
            <img src={project.cover} alt={project.coverAlt ?? ""} loading="lazy" />
          ) : (
            <div className="code-cover" aria-hidden="true">
              <span>{project.title.slice(0, 2).toUpperCase()}</span>
              <i />
              <i />
              <i />
            </div>
          )}
          <span className="project-card__index">{project.category}</span>
        </div>
        <div className="project-card__body">
          <div>
            <h2>{project.title}</h2>
            <p>{project.subtitle}</p>
          </div>
          <span className="project-card__arrow" aria-hidden="true">↗</span>
        </div>
      </Link>
    </article>
  );
}
