"use client";

import { useState } from "react";
import { categories, projects, type ProjectCategory } from "@/lib/projects";
import { ProjectCard } from "@/app/components/ProjectCard";

type Filter = "All" | ProjectCategory;
type SortMode = "category" | "alphabetical" | "time";

const categoryOrder = categories.slice(1) as ProjectCategory[];
const originalOrder = new Map(projects.map((project, index) => [project.slug, index]));

function getProjectYear(period: string) {
  const years = period.match(/\b(?:19|20)\d{2}\b/g)?.map(Number) ?? [];
  return years.length > 0 ? Math.max(...years) : Number.NEGATIVE_INFINITY;
}

export function ProjectIndex() {
  const [filter, setFilter] = useState<Filter>("All");
  const [sortMode, setSortMode] = useState<SortMode>("category");
  const filtered = filter === "All" ? projects : projects.filter((project) => project.category === filter);
  const visible = [...filtered].sort((first, second) => {
    if (sortMode === "alphabetical") {
      return first.title.localeCompare(second.title, "en", { sensitivity: "base" });
    }

    if (sortMode === "time") {
      const firstYear = getProjectYear(first.period);
      const secondYear = getProjectYear(second.period);
      if (firstYear !== secondYear) return secondYear - firstYear;
    }

    if (sortMode === "category") {
      const categoryDifference =
        categoryOrder.indexOf(first.category) - categoryOrder.indexOf(second.category);
      if (categoryDifference !== 0) return categoryDifference;
    }

    return (originalOrder.get(first.slug) ?? 0) - (originalOrder.get(second.slug) ?? 0);
  });

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
                  ? projects.length
                  : projects.filter((project) => project.category === category).length}
              </span>
            </button>
          ))}
        </div>
        <label className="project-sort">
          <span>Sort by</span>
          <span className="project-sort__field">
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              aria-label="Sort projects"
            >
              <option value="category">Category</option>
              <option value="alphabetical">Alphabetical A–Z</option>
              <option value="time">Time — newest first</option>
            </select>
            <span className="project-sort__arrow" aria-hidden="true">↓</span>
          </span>
        </label>
      </div>
      <p className="filter-summary" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"} · Sorted by {sortMode}
      </p>
      <div className="project-grid project-grid--all">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  );
}
