export type ProjectCategory =
  | "Computer Science"
  | "Academic Architecture"
  | "Architecture Practice"
  | "Visual Studies";

export type ProjectFact = {
  label: string;
  value: string;
};

export type ProjectSection = {
  label: string;
  title: string;
  body: string[];
  points?: string[];
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  time: string;
  period: string;
  location?: string;
  role: string;
  status: string;
  excerpt: string;
  statement: string;
  accent: string;
  codeAccent?: string;
  cover?: string;
  coverAlt?: string;
  containCover?: boolean;
  visualOnly?: boolean;
  showSections?: boolean;
  featured?: boolean;
  cardSize?: "wide" | "standard";
  facts: ProjectFact[];
  sections: ProjectSection[];
  gallery?: ProjectImage[];
  galleryLayout?: "process-triptych";
  galleryLabel?: string;
  galleryTitle?: string;
  links?: ProjectLink[];
};
