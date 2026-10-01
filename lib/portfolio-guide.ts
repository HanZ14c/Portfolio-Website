import { publicProjects } from "@/lib/projects";

export type GuideMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GuideLink = {
  label: string;
  href: string;
};

export type GuideReply = {
  answer: string;
  links: GuideLink[];
};

const contactLinks: GuideLink[] = [
  { label: "Download résumé", href: "/Han-Zhang-Resume.pdf" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hanz14c/" },
  { label: "GitHub", href: "https://github.com/HanZ14c" },
];

const normalize = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, " ").trim();

const projectSearchText = (project: (typeof publicProjects)[number]) => normalize([
  project.title,
  project.subtitle,
  project.category,
  project.role,
  project.excerpt,
  project.statement,
  ...(project.highlights ?? []),
  ...project.facts.flatMap((fact) => [fact.label, fact.value]),
  ...project.sections.flatMap((section) => [section.title, ...section.body, ...(section.points ?? [])]),
].join(" "));

const projectLink = (project: (typeof publicProjects)[number]): GuideLink => ({
  label: project.title,
  href: `/work/${project.slug}`,
});

const summarizeProjects = (matchingProjects: typeof publicProjects, introduction: string): GuideReply => {
  const selection = matchingProjects.slice(0, 4);

  if (selection.length === 0) {
    return {
      answer: "I could not find a project that matches that description in the published portfolio. Try asking about computer science, architecture, visual studies, Java, databases or rendering.",
      links: [{ label: "Browse all work", href: "/work" }],
    };
  }

  const titles = selection.map((project) => `${project.title} (${project.time})`).join(", ");
  return {
    answer: `${introduction} ${titles}. Open a project below for its role, process and technical or design details.`,
    links: selection.map(projectLink),
  };
};

export function createPortfolioGuideReply(question: string): GuideReply {
  const query = normalize(question);

  const exactProject = publicProjects.find((project) => {
    const title = normalize(project.title);
    const slug = normalize(project.slug);
    return query.includes(title) || query.includes(slug);
  });

  if (exactProject) {
    const facts = exactProject.facts.slice(0, 3).map((fact) => `${fact.label}: ${fact.value}`).join(" · ");
    return {
      answer: `${exactProject.title} is a ${exactProject.time} ${exactProject.category.toLocaleLowerCase()} project. ${exactProject.excerpt}${facts ? ` Key details — ${facts}.` : ""}`,
      links: [projectLink(exactProject)],
    };
  }

  if (/\b(hello|hi|hey|help)\b|你好|您好|怎么问/.test(query)) {
    return {
      answer: "I can help you navigate Han's published work, background and skills. Ask for projects relevant to a role, a technology such as Java or SQL, an architecture topic, or a specific project title.",
      links: [{ label: "Browse all work", href: "/work" }],
    };
  }

  if (/contact|email|linkedin|github|resume|résumé|cv|联系|邮箱|简历/.test(query)) {
    return {
      answer: "You can contact Han by email at hanz14c@gmail.com, review the résumé, or continue through LinkedIn and GitHub.",
      links: contactLinks,
    };
  }

  if (/transition|background|architecture.*(cs|computer|software)|(?:cs|computer|software).*architecture|转行|背景|建筑.*计算机|计算机.*建筑/.test(query)) {
    return {
      answer: "Han trained and worked in architecture before moving into computer science. The shared thread is systems thinking: architecture developed spatial coordination and visual communication, while computer science added application logic, databases, networking and implementation.",
      links: [
        { label: "Read the full profile", href: "/about" },
        { label: "View all work", href: "/work" },
      ],
    };
  }

  if (/java|javafx|junit|tcp|socket/.test(query)) {
    return summarizeProjects(
      publicProjects.filter((project) => /java|javafx|junit|tcp|socket/.test(projectSearchText(project))),
      "The strongest Java-related projects are",
    );
  }

  if (/database|sql|mysql|data model|relational|数据库|数据建模/.test(query)) {
    return summarizeProjects(
      publicProjects.filter((project) => /database|sql|mysql|relational|data model/.test(projectSearchText(project))),
      "For database and data-modelling work, start with",
    );
  }

  if (/team|collaborat|workflow|shared|团队|协作/.test(query)) {
    return summarizeProjects(
      publicProjects.filter((project) => /team|collaborat|workflow|shared|client server/.test(projectSearchText(project))),
      "Projects that foreground shared workflows or collaboration include",
    );
  }

  if (/visual|render|lumion|photoshop|drawing|sketch|art|视觉|渲染|手绘|绘画/.test(query)) {
    return summarizeProjects(
      publicProjects.filter((project) => project.category === "Visual Studies"),
      "The visual studies collection currently includes",
    );
  }

  if (/architecture|building|housing|urban|public space|建筑|空间|住宅|城市/.test(query)) {
    return summarizeProjects(
      publicProjects.filter((project) => project.category.includes("Architecture")),
      "A useful cross-section of Han's architecture work is",
    );
  }

  if (/software|computer science|developer|backend|frontend|code|program|cs project|计算机|软件|编程|开发/.test(query)) {
    return summarizeProjects(
      publicProjects.filter((project) => project.category === "Computer Science"),
      "For a computer-science or software role, review",
    );
  }

  const keywordMatches = publicProjects.filter((project) => {
    const searchable = projectSearchText(project);
    return query.split(" ").filter((term) => term.length >= 3).some((term) => searchable.includes(term));
  });

  if (keywordMatches.length > 0) {
    return summarizeProjects(keywordMatches, "These published projects are the closest match:");
  }

  return {
    answer: "I am a portfolio guide rather than a general-purpose chatbot. I can answer questions about Han's projects, education, architecture background, computer-science skills, visual work and contact information.",
    links: [
      { label: "Browse all work", href: "/work" },
      { label: "Read the profile", href: "/about" },
    ],
  };
}

export function getPortfolioGuideContext(): string {
  const projectContext = publicProjects.map((project) => [
    `Title: ${project.title}`,
    `URL: /work/${project.slug}`,
    `Category: ${project.category}`,
    `Time: ${project.time}`,
    `Role: ${project.role}`,
    `Summary: ${project.excerpt}`,
    `Intent: ${project.statement}`,
    `Highlights: ${(project.highlights ?? []).join("; ")}`,
    `Facts: ${project.facts.map((fact) => `${fact.label}: ${fact.value}`).join("; ")}`,
  ].join("\n")).join("\n\n");

  return [
    "Han Zhang is a computer science student at the University of British Columbia and a former architectural designer at Hong Kong Huayi Design Consultant (Shenzhen).",
    "Education: UBC Bachelor of Computer Science, expected 2028; Langara College Computer Studies, 2023–2025; Xi'an University of Technology Bachelor of Engineering in Architecture, 2013–2018.",
    "Core areas: Java, C, C++, JavaScript, Python, SQL, JavaFX, Swing, JUnit, Git, TCP sockets, HTML, CSS, PHP, MySQL, SQL Server, Adobe Creative Suite, Figma, AutoCAD, SketchUp, Rhino and Lumion.",
    "Contact: hanz14c@gmail.com; LinkedIn: https://www.linkedin.com/in/hanz14c/; GitHub: https://github.com/HanZ14c; résumé: /Han-Zhang-Resume.pdf.",
    "Published projects:",
    projectContext,
  ].join("\n\n");
}
