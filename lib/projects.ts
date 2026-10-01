import type { Project, ProjectCategory } from "@/lib/projects/types";

export type { Project, ProjectCategory } from "@/lib/projects/types";

import projectData from "./projects/data.json";

export const projects = projectData as Project[];

export const categories: Array<"All" | ProjectCategory> = [
  "All",
  "Computer Science",
  "Academic Architecture",
  "Architecture Practice",
  "Visual Studies",
];

export const publicProjects = projects.filter((project) => !project.hidden);

export function getProject(slug: string) {
  return publicProjects.find((project) => project.slug === slug);
}

export function getRelatedProjects(project: Project, limit = 3) {
  return publicProjects
    .filter(
      (candidate) =>
        candidate.slug !== project.slug && candidate.category === project.category,
    )
    .slice(0, limit);
}

export function getProjectNeighbors(project: Project) {
  const orderedProjects = categories
    .filter((category): category is ProjectCategory => category !== "All")
    .flatMap((category) => publicProjects.filter((candidate) => candidate.category === category));
  const currentIndex = orderedProjects.findIndex((candidate) => candidate.slug === project.slug);

  return {
    previous: currentIndex > 0 ? orderedProjects[currentIndex - 1] : undefined,
    next: currentIndex >= 0 && currentIndex < orderedProjects.length - 1
      ? orderedProjects[currentIndex + 1]
      : undefined,
    position: currentIndex + 1,
    total: orderedProjects.length,
  };
}
