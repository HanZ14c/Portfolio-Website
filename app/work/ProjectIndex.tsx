"use client";

import { useState } from "react";
import { categories, publicProjects, type ProjectCategory } from "@/lib/projects";
import {
  groupProjects,
  sortLabels,
  sortProjects,
  type ProjectSortMode,
} from "@/lib/project-index";
import { ProjectCard } from "@/app/components/ProjectCard";

type Filter = "All" | ProjectCategory;

const categoryOrder = categories.slice(1) as ProjectCategory[];
const originalOrder = new Map(publicProjects.map((project, index) => [project.slug, index]));

export function ProjectIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sortMode, setSortMode] = useState<ProjectSortMode>("category");
  const filtered = filter === "All"
    ? publicProjects
    : publicProjects.filter((project) => project.category === filter);
  const visible = sortProjects(filtered, sortMode, categoryOrder, originalOrder);
  const groups = groupProjects(visible, sortMode);

  return (
    <>
      <div className="project-controls">
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
                  ? publicProjects.length
                  : publicProjects.filter((project) => project.category === category).length}
              </span>
            </button>
          ))}
        </div>
        <label className="project-sort">
          <span>Sort by</span>
          <span className="project-sort__field">
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as ProjectSortMode)}
              aria-label="Sort projects"
            >
              <option value="category">Category</option>
              <option value="alphabetical">Alphabetical A–Z</option>
              <option value="time">End time — newest first</option>
            </select>
            <span className="project-sort__arrow" aria-hidden="true">↓</span>
          </span>
        </label>
      </div>
      <p className="filter-summary" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"} · Sorted by {sortLabels[sortMode]}
      </p>
      {filter === "All" ? (
        <div className="project-groups" aria-label={`Projects grouped by ${sortLabels[sortMode]}`}>
          {groups.map((group, index) => (
            <section className="project-group" key={group.label}>
              <header className="project-group__heading">
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{sortLabels[sortMode]}</p>
                </div>
                <h2>{group.label}</h2>
                <p>{group.projects.length} {group.projects.length === 1 ? "project" : "projects"}</p>
              </header>
              <div className="project-grid project-grid--all">
                {group.projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="project-grid project-grid--all">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
