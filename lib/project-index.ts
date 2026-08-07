import type { Project, ProjectCategory } from "@/lib/projects/types";

export type ProjectSortMode = "category" | "alphabetical" | "time";

export const sortLabels: Record<ProjectSortMode, string> = {
  category: "category",
  alphabetical: "alphabetical order",
  time: "end time",
};

export function getProjectEndYear(time: string) {
  if (/\b(?:present|ongoing|current|now)\b/i.test(time)) return Number.POSITIVE_INFINITY;
  const years = time.match(/\b(?:19|20)\d{2}\b/g)?.map(Number) ?? [];
  return years.length > 0 ? Math.max(...years) : Number.NEGATIVE_INFINITY;
}

export function getEndTimeLabel(time: string) {
  const endYear = getProjectEndYear(time);
  if (endYear === Number.POSITIVE_INFINITY) return "Ongoing";
  if (endYear === Number.NEGATIVE_INFINITY) return "XXXX";
  return String(endYear);
}

export function getProjectGroupLabel(project: Project, sortMode: ProjectSortMode) {
  if (sortMode === "category") return project.category;
  if (sortMode === "alphabetical") return project.title.trim().charAt(0).toUpperCase();
  return getEndTimeLabel(project.time);
}

export function sortProjects(
  source: Project[],
  sortMode: ProjectSortMode,
  categoryOrder: ProjectCategory[],
  originalOrder: Map<string, number>,
) {
  return [...source].sort((first, second) => {
    if (sortMode === "alphabetical") {
      return first.title.localeCompare(second.title, "en", { sensitivity: "base" });
    }

    if (sortMode === "time") {
      const firstYear = getProjectEndYear(first.time);
      const secondYear = getProjectEndYear(second.time);
      if (firstYear !== secondYear) return secondYear - firstYear;
    }

    if (sortMode === "category") {
      const categoryDifference =
        categoryOrder.indexOf(first.category) - categoryOrder.indexOf(second.category);
      if (categoryDifference !== 0) return categoryDifference;
    }

    return (originalOrder.get(first.slug) ?? 0) - (originalOrder.get(second.slug) ?? 0);
  });
}

export function groupProjects(projects: Project[], sortMode: ProjectSortMode) {
  return projects.reduce<Array<{ label: string; projects: Project[] }>>((result, project) => {
    const label = getProjectGroupLabel(project, sortMode);
    const currentGroup = result.at(-1);

    if (currentGroup?.label === label) {
      currentGroup.projects.push(project);
    } else {
      result.push({ label, projects: [project] });
    }

    return result;
  }, []);
}
