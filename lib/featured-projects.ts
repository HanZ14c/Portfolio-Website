import { projects } from "@/lib/projects";

export const featuredProjectSlugs = [
  "emotion-time",
  "bc-travel-guide",
  "team-workflow-scheduler",
  "qianhai-shimao-centre",
  "car-dealership-manager",
  "grid-pursuit-cheese",
  "bungalow",
  "architectural-hand-sketches",
  "family-tree-database",
] as const;

export function getFeaturedProjects() {
  return featuredProjectSlugs.map((slug) => {
    const project = projects.find((candidate) => candidate.slug === slug);

    if (!project) {
      throw new Error(`Featured project not found: ${slug}`);
    }

    return project;
  });
}
