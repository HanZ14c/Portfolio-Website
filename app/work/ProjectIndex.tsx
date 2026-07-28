"use client";

import { useState } from "react";
import { categories, projects, type ProjectCategory } from "@/lib/projects";
import { ProjectCard } from "@/app/components/ProjectCard";

type Filter = "All" | ProjectCategory;

export function ProjectIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <>
      <div className="project-filters" aria-label="Filter projects">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
          >
            {category}
            <span>
              {category === "All"
                ? projects.length
                : projects.filter((project) => project.category === category).length}
            </span>
          </button>
        ))}
      </div>
      <p className="filter-summary" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>
      <div className="project-grid project-grid--all">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
