import { projects } from "@/lib/projects";

import featuredSlugs from "./projects/featured.json";

export const featuredProjectSlugs: readonly string[] = featuredSlugs;

export function getFeaturedProjects() {
  return featuredProjectSlugs.map((slug) => {
    const project = projects.find((candidate) => candidate.slug === slug);

    if (!project) {
      throw new Error(`Featured project not found: ${slug}`);
    }

    return project;
  }).filter((project) => !project.hidden);
}
