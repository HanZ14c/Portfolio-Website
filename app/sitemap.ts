import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/work", "/about"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: absoluteUrl(`/work/${project.slug}`),
    changeFrequency: "yearly" as const,
    priority: project.featured ? 0.8 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
