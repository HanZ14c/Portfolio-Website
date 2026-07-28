export type ProjectCategory =
  | "Software"
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
  period: string;
  location?: string;
  role: string;
  status: string;
  excerpt: string;
  statement: string;
  accent: string;
  cover?: string;
  coverAlt?: string;
  containCover?: boolean;
  featured?: boolean;
  cardSize?: "wide" | "standard";
  facts: ProjectFact[];
  sections: ProjectSection[];
  gallery?: ProjectImage[];
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "vertical-city-housing",
    title: "Vertical City Housing",
    subtitle: "垂直城市 — 西安保利曲江春天里小区设计",
    category: "Academic Architecture",
    period: "2018",
    location: "Xi'an, China",
    role: "Individual graduation design",
    status: "Academic / Unbuilt",
    excerpt:
      "A high-density housing proposal that turns circulation, landscape and shared programs into a three-dimensional neighbourhood.",
    statement:
      "The project asks how a residential complex can behave less like a stack of isolated apartments and more like a small city.",
    accent: "#a8c98f",
    cover: "/media/vertical-city/hero.webp",
    coverAlt: "Aerial rendering of the Vertical City residential proposal",
    featured: true,
    cardSize: "wide",
    facts: [
      { label: "Site", value: "49,550 m²" },
      { label: "Floor area", value: "112,010 m²" },
      { label: "FAR", value: "2.26" },
      { label: "Height", value: "58.45 m / 20 storeys" },
      { label: "Green ratio", value: "55%" },
      { label: "Parking", value: "897 spaces" },
    ],
    sections: [
      {
        label: "01 / Premise",
        title: "Housing as a small city",
        body: [
          "Rapid urbanization made high-rise housing an efficient answer to density, but it also produced standardized living, weaker neighbourhood relationships and limited contact with nature. The project uses the idea of the vertical city as a framework for reconnecting private dwellings with collective life.",
          "The research draws from Aldo van Eyck's relationship between the house and the city, Le Corbusier's Unité d'Habitation and high-density housing precedents in Singapore.",
        ],
        points: [
          "Functional complexity",
          "Spatial diversity",
          "Environmental integration",
          "Individualized form",
        ],
      },
      {
        label: "02 / Planning",
        title: "Three courtyards, many elevations",
        body: [
          "The site is divided into three connected courtyard groups. Buildings are cut to form entrances, broken into smaller volumes and varied in height to open views toward Qujiangchi Heritage Park.",
          "Vehicles remain on a semi-peripheral route while pedestrian paths occupy the inner landscape. Commercial programs line the outer edge, and bridges extend the public circulation above ground level.",
        ],
      },
      {
        label: "03 / Living system",
        title: "The corridor becomes an elevated street",
        body: [
          "Single-loaded duplex units reinterpret the interlocking logic of the Marseille apartment. Flexible partitions, cross ventilation, generous balconies and several unit sizes support different households.",
          "Exterior corridors connect to sky bridges, corner commons, roof platforms and double-height voids. These spaces create a continuous network for meeting, playing and moving through the community.",
        ],
      },
    ],
    gallery: [
      {
        src: "/media/vertical-city/board-2.webp",
        alt: "Massing development, aerial view and housing units",
        caption: "Massing generation and duplex unit studies.",
      },
      {
        src: "/media/vertical-city/board-3.webp",
        alt: "Vertical city precedent analysis and masterplan",
        caption: "Precedent research, masterplan and elevated public-space system.",
      },
      {
        src: "/media/vertical-city/board-5.webp",
        alt: "Circulation, entrance renderings and elevations",
        caption: "Pedestrian and vehicle networks, entrances and community elevations.",
      },
      {
        src: "/media/vertical-city/board-6.webp",
        alt: "Courtyard renderings, parking and daylight analysis",
        caption: "Shared spaces, technical coordination and courtyard experience.",
      },
    ],
  },
  {
    slug: "team-workflow-scheduler",
    title: "Team Workflow Scheduler",
    subtitle: "A client-server task management system",
    category: "Software",
    period: "Selected software project",
    role: "Application design and implementation",
    status: "Repository available",
    excerpt:
      "A Java task manager connecting a JavaFX desktop client and a command-line client to a multi-client TCP server.",
    statement:
      "A compact exercise in keeping several clients, a shared task lifecycle and persistent state consistent.",
    accent: "#ff5636",
    featured: true,
    cardSize: "standard",
    facts: [
      { label: "Language", value: "Java" },
      { label: "Interface", value: "JavaFX + CLI" },
      { label: "Network", value: "TCP sockets" },
      { label: "Storage", value: "JSON" },
    ],
    sections: [
      {
        label: "01 / Problem",
        title: "One workflow, several clients",
        body: [
          "The application manages tasks across a graphical desktop client and a command-line client. Both communicate with a shared server, so task state must remain predictable even when several users connect at the same time.",
        ],
      },
      {
        label: "02 / System",
        title: "A small distributed application",
        body: [
          "The server accepts concurrent TCP connections, interprets client commands and applies changes through one task lifecycle. JSON persistence restores the workspace between sessions, while automatic status updates keep overdue tasks current.",
        ],
        points: [
          "Multi-client socket handling",
          "Shared task lifecycle",
          "Automatic overdue-state updates",
          "JavaFX and command-line interfaces",
        ],
      },
      {
        label: "03 / Quality",
        title: "Behaviour made testable",
        body: [
          "The project separates domain behaviour from presentation and transport concerns. JUnit tests cover the task model and application behaviour, making changes safer as the feature set grows.",
        ],
      },
    ],
    links: [
      {
        label: "View repository",
        href: "https://github.com/HanZ14c/Team-Workflow-Scheduler",
      },
    ],
  },
  {
    slug: "emotion-time",
    title: "Emotion Time",
    subtitle: "情感的形意场语言生成",
    category: "Academic Architecture",
    period: "Academic project / Later revision",
    location: "Xi'an, China",
    role: "Individual design and independent revision",
    status: "Academic / Unbuilt",
    excerpt:
      "A library and cultural space that translates emotion, perception, events and movement into a field of spatial encounters.",
    statement:
      "Instead of beginning with rooms, the project begins with feelings and asks what kinds of events a space can invite.",
    accent: "#ed1f24",
    cover: "/media/emotion-time/revised-4.webp",
    coverAlt: "Exploded axonometric drawing of Emotion Time",
    featured: true,
    cardSize: "wide",
    facts: [
      { label: "Type", value: "Library / Cultural space" },
      { label: "Context", value: "Beilin historic district" },
      { label: "Versions", value: "School proposal + independent revision" },
      { label: "Final display", value: "Revised proposal" },
    ],
    sections: [
      {
        label: "01 / Research",
        title: "From emotion to spatial language",
        body: [
          "The original project developed an entity-sense-field framework. Emotional impressions were abstracted into elements, then combined into spatial situations involving enclosure, exposure, encounter, hesitation and movement.",
          "This research became a catalogue of possible relationships rather than a fixed formal vocabulary.",
        ],
      },
      {
        label: "02 / Revision",
        title: "Space, event and movement",
        body: [
          "The later independent revision shifts attention from isolated emotional rooms to the uncertain relationship between architecture and use. Parallel drawing sequences test the building as an object, as an empty spatial condition and as a field occupied by events.",
        ],
      },
      {
        label: "03 / Proposal",
        title: "A fragmented cultural field",
        body: [
          "Courtyards, reading rooms, water, screens, stairs and changing light form a porous composition within the historic district. Routes overlap and spaces remain open to more than one interpretation, allowing visitors to construct their own sequence.",
        ],
      },
    ],
    gallery: [
      {
        src: "/media/emotion-time/revised-2.webp",
        alt: "Context research and massing generation for Emotion Time",
        caption: "Context, site and massing development in the revised proposal.",
      },
      {
        src: "/media/emotion-time/revised-3.webp",
        alt: "Event and spatial sequence research diagrams",
        caption: "Parallel sequences testing space, event and movement.",
      },
      {
        src: "/media/emotion-time/revised-5.webp",
        alt: "Plan and interior views of Emotion Time",
        caption: "Plan, material atmosphere and spatial fragments.",
      },
      {
        src: "/media/emotion-time/original-2.webp",
        alt: "Original emotion-space generation board",
        caption: "The original school project: emotional language and spatial generation.",
      },
      {
        src: "/media/emotion-time/original-3.webp",
        alt: "Original axonometric and activity board",
        caption: "The original proposal retained as process material.",
      },
    ],
  },
  {
    slug: "mirriedge-opera-house",
    title: "MIRRIEDGE",
    subtitle: "The Gleam Within — Opera House",
    category: "Academic Architecture",
    period: "Academic project",
    location: "Xi'an Chanba, China",
    role: "Individual design",
    status: "Academic / Unbuilt",
    excerpt:
      "A performing arts centre shaped by light, reflection, iridescent ceramic surfaces and the movement of different audiences.",
    statement:
      "The building is conceived as a restrained solid whose inner life appears through changing light and reflective edges.",
    accent: "#c92637",
    cover: "/media/mirriedge/hero.webp",
    coverAlt: "Night rendering of the MIRRIEDGE opera house",
    featured: true,
    cardSize: "wide",
    facts: [
      { label: "Type", value: "Opera house / Performing arts" },
      { label: "Concept", value: "Light, shadow and iridescence" },
      { label: "Circulation", value: "Audience / Performer / Service" },
      { label: "Scope", value: "Concept through technical study" },
    ],
    sections: [
      {
        label: "01 / Atmosphere",
        title: "The gleam within",
        body: [
          "Layered cantilevered volumes form a quiet exterior silhouette. A glazed foyer, deep reveals, louvers and a pearlescent ceramic facade register changes in daylight and reveal the energy of performance after dark.",
        ],
      },
      {
        label: "02 / Movement",
        title: "Three paths through one building",
        body: [
          "Audience, performer and service circulation are separated where necessary and reconnected through the stage and public foyer. Outdoor projection and performance areas extend the programme into the surrounding landscape.",
        ],
      },
      {
        label: "03 / Resolution",
        title: "Beyond the exterior image",
        body: [
          "The proposal includes auditorium sightline and acoustic studies, stage organization, structural coordination, facade details, plans, sections, elevations and interior visualizations.",
        ],
      },
    ],
    gallery: [
      {
        src: "/media/mirriedge/concept.webp",
        alt: "Opera house site, facade concept and main plans",
        caption: "Site strategy, facade atmosphere and public organization.",
      },
      {
        src: "/media/mirriedge/technical.webp",
        alt: "Sections, elevations and technical studies",
        caption: "Sightlines, sections, elevations and technical coordination.",
      },
      {
        src: "/media/mirriedge/experience.webp",
        alt: "Interior and exterior opera house visualizations",
        caption: "Interior sequence and the building at night.",
      },
    ],
  },
  {
    slug: "bc-travel-guide",
    title: "BC Travel Guide",
    subtitle: "Responsive destination storytelling",
    category: "Software",
    period: "Selected web project",
    role: "Web design and implementation",
    status: "Live demo available",
    excerpt:
      "A responsive multi-page travel website combining destination stories, media and an optional subscription backend.",
    statement:
      "A content-led web project focused on organizing destinations into a clear, responsive browsing experience.",
    accent: "#427d65",
    featured: true,
    facts: [
      { label: "Front end", value: "HTML / CSS / JavaScript" },
      { label: "Back end", value: "PHP / MySQL" },
      { label: "Format", value: "Responsive multi-page site" },
      { label: "Status", value: "Published demo" },
    ],
    sections: [
      {
        label: "01 / Content",
        title: "Destinations as stories",
        body: [
          "The site organizes British Columbia destinations through images, written introductions and video. Navigation and page hierarchy keep a growing set of places understandable on both desktop and mobile screens.",
        ],
      },
      {
        label: "02 / Experience",
        title: "A responsive reading flow",
        body: [
          "HTML and CSS establish the editorial structure, while JavaScript supports interactive behaviour. The layout adapts from large image-led pages to compact mobile reading without hiding essential content.",
        ],
      },
      {
        label: "03 / Extension",
        title: "Optional subscription workflow",
        body: [
          "A PHP and MySQL path extends the static experience with a local subscription workflow, connecting interface design with basic server-side data handling.",
        ],
      },
    ],
    links: [
      { label: "View repository", href: "https://github.com/HanZ14c/BC-Travel-Guide" },
      { label: "Open live demo", href: "https://hanz14c.github.io/BC-Travel-Guide/" },
    ],
  },
  {
    slug: "qianhai-shimao-centre",
    title: "CM Qianhai Shimao Centre",
    subtitle: "Civic pavilions within a mixed-use development",
    category: "Architecture Practice",
    period: "2018–2020",
    location: "Shenzhen, China",
    role: "Architectural assistant — basement technical drawings and consultant coordination",
    status: "Completed / Professional team project",
    excerpt:
      "Three public pavilions respond to distinct functions and positions within a larger urban development.",
    statement:
      "My contribution focused on translating a complex public project into coordinated basement documentation.",
    accent: "#e8b3ac",
    cover: "/media/architecture-practice/qianhai-shimao.webp",
    coverAlt: "Public pavilion at CM Qianhai Shimao Centre",
    featured: true,
    facts: [
      { label: "Employer", value: "Hong Kong Huayi Design Consultant" },
      { label: "Collaborator", value: "HASSELL (Hong Kong)" },
      { label: "Contribution", value: "Technical drawings" },
      { label: "Coordination", value: "Civil defence / Fire / MEP" },
    ],
    sections: [
      {
        label: "01 / Project",
        title: "Three distinct civic pavilions",
        body: [
          "The Shenzhen development contains three pavilions, each shaped by a different programme and position in the public realm. The architectural language connects cultural activity with a larger commercial and urban context.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "Coordination below the public ground",
        body: [
          "Working under the project architect, I completed basement detail drawings and communicated with engineering disciplines to resolve civil air-defence, fire-resistance and MEP requirements.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "This page records my contribution within a larger professional team. Design authorship and project credit remain with the respective firms and collaborators.",
        ],
      },
    ],
  },
  {
    slug: "car-dealership-manager",
    title: "Car Dealership Manager",
    subtitle: "Modular desktop inventory and sales application",
    category: "Software",
    period: "Selected software project",
    role: "Application design and implementation",
    status: "Repository available",
    excerpt:
      "A Java Swing application for inventory, customers, brokers and sales, supported by persistence, tests and UML documentation.",
    statement:
      "A desktop application organized around clear domain boundaries rather than a collection of disconnected forms.",
    accent: "#f3b64b",
    facts: [
      { label: "Language", value: "Java" },
      { label: "Interface", value: "Swing" },
      { label: "Storage", value: "JSON" },
      { label: "Quality", value: "JUnit / Checkstyle / UML" },
    ],
    sections: [
      {
        label: "01 / Domain",
        title: "A dealership as connected records",
        body: [
          "Vehicles, customers, brokers and sales each have their own behaviour, but the application must connect them without duplicating business rules across screens.",
        ],
      },
      {
        label: "02 / Interface",
        title: "A modular tab-based workspace",
        body: [
          "The Swing interface groups daily operations into focused tabs. Event logging and JSON persistence provide continuity, while the domain model remains usable independently of the interface.",
        ],
      },
      {
        label: "03 / Documentation",
        title: "Design that can be inspected",
        body: [
          "JUnit tests, Checkstyle and a documented UML model make the architecture visible and support disciplined iteration.",
        ],
      },
    ],
    links: [
      { label: "View repository", href: "https://github.com/HanZ14c/Car-Dealership-Manager" },
    ],
  },
  {
    slug: "shenzhen-junior-high-school",
    title: "Shenzhen Junior High School",
    subtitle: "A compact vertical campus",
    category: "Architecture Practice",
    period: "2018–2020",
    location: "Shenzhen, China",
    role: "Architectural assistant — programming and early form exploration",
    status: "Completed / Professional team project",
    excerpt:
      "A constrained school site organized as a dense, connected campus with layered courtyards and shared space.",
    statement:
      "The design challenge was to fit many educational functions into a small site without losing collective outdoor space.",
    accent: "#ba7a62",
    cover: "/media/architecture-practice/shenzhen-junior-school.webp",
    coverAlt: "Completed Shenzhen Junior High School campus",
    facts: [
      { label: "Type", value: "Education" },
      { label: "Contribution", value: "Programming" },
      { label: "Study", value: "Building form exploration" },
      { label: "Context", value: "Constrained urban site" },
    ],
    sections: [
      {
        label: "01 / Constraint",
        title: "Many programmes, limited land",
        body: [
          "The school combines classrooms, sports, circulation and collective space on a compact site with demanding functional requirements.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "Programming before form",
        body: [
          "I contributed to architectural programming and explored building forms that could connect multiple functions. The resulting scheme uses a vertical-campus approach to preserve shared outdoor spaces.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "The project was completed by a professional design team. This case study focuses on the programming and early design work in which I participated.",
        ],
      },
    ],
  },
  {
    slug: "grid-pursuit-cheese",
    title: "Grid Pursuit: Cheese",
    subtitle: "A browser-based pursuit game",
    category: "Software",
    period: "Selected web project",
    role: "Game logic and interface implementation",
    status: "Playable demo available",
    excerpt:
      "A 10×10 Canvas game with queued player actions, randomized enemies, traps, walls, scoring and collision detection.",
    statement:
      "A small game used to make state, timing and collision rules visible through immediate browser interaction.",
    accent: "#cf5a35",
    facts: [
      { label: "Runtime", value: "Browser" },
      { label: "Rendering", value: "HTML5 Canvas" },
      { label: "Logic", value: "JavaScript" },
      { label: "Board", value: "10 × 10 grid" },
    ],
    sections: [
      {
        label: "01 / Rules",
        title: "A readable grid, unpredictable pressure",
        body: [
          "The player navigates a compact board while enemies move with randomized behaviour. Walls, traps and scoring create tactical choices without obscuring the basic rules.",
        ],
      },
      {
        label: "02 / Logic",
        title: "State changes in a controlled order",
        body: [
          "Queued player actions, enemy movement and collision detection are resolved as explicit stages. Separating these stages prevents one input from producing inconsistent board states.",
        ],
      },
      {
        label: "03 / Interface",
        title: "Canvas as a compact renderer",
        body: [
          "The Canvas API draws the board and its changing entities efficiently, while surrounding HTML and CSS provide instructions and responsive framing.",
        ],
      },
    ],
    links: [
      { label: "View repository", href: "https://github.com/HanZ14c/Grid-Pursuit-Cheese" },
      { label: "Play demo", href: "https://hanz14c.github.io/Grid-Pursuit-Cheese/" },
    ],
  },
  {
    slug: "heshan-ocean-world",
    title: "Jiangmen Heshan Ocean World",
    subtitle: "Hotel, water park, retail and leisure district",
    category: "Architecture Practice",
    period: "2018–2020",
    location: "Jiangmen, China",
    role: "Architectural assistant — form and facade studies",
    status: "Professional team project",
    excerpt:
      "A mixed leisure destination shaped as a pedestrian-friendly commercial cluster with a contemporary regional identity.",
    statement:
      "My work explored how varied programmes could read as one walkable district rather than isolated attractions.",
    accent: "#74a6b0",
    cover: "/media/architecture-practice/heshan-ocean-world.webp",
    coverAlt: "Commercial street rendering at Jiangmen Heshan Ocean World",
    facts: [
      { label: "Type", value: "Leisure / Hospitality / Retail" },
      { label: "Contribution", value: "Hotel and retail form studies" },
      { label: "Tools", value: "SketchUp" },
      { label: "Output", value: "Facade options and client presentations" },
    ],
    sections: [
      {
        label: "01 / Programme",
        title: "A destination made from several worlds",
        body: [
          "The project combines a hotel, water park, retail and leisure uses. The design organizes them around pedestrian movement and a sequence of public spaces.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "Form and facade options",
        body: [
          "I participated in hotel and retail form design in SketchUp, developed facade options and presented alternatives to the client. The studies explored a contemporary Chinese character without turning the district into a literal historical reproduction.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "This case study presents my design studies within the larger project produced by Hong Kong Huayi Design Consultant and its project team.",
        ],
      },
    ],
  },
  {
    slug: "guangzhou-najin-business-area",
    title: "Guangzhou Najin Business Area",
    subtitle: "A connected office and commercial campus",
    category: "Architecture Practice",
    period: "2018–2020",
    location: "Guangzhou, China",
    role: "Architectural assistant — programming and form development",
    status: "Professional team project",
    excerpt:
      "A business district on an irregular site, composed as a family of blocks and connecting pavilions.",
    statement:
      "The project turns a difficult site boundary into a sequence of related buildings and public gaps.",
    accent: "#79a38d",
    cover: "/media/architecture-practice/guangzhou-najin.webp",
    coverAlt: "Street rendering of Guangzhou Najin Business Area",
    facts: [
      { label: "Type", value: "Office / Commercial" },
      { label: "Contribution", value: "Architectural programming" },
      { label: "Tools", value: "AutoCAD / Rhino" },
      { label: "Study", value: "Final massing support" },
    ],
    sections: [
      {
        label: "01 / Site",
        title: "Working with an irregular boundary",
        body: [
          "The elongated and irregular site required a building family that could address several edges while maintaining a coherent identity.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "From programme to massing",
        body: [
          "I undertook architectural programming in AutoCAD and assisted the project architect in defining the final building forms through Rhino studies. Connecting pavilions help the separate blocks operate as one campus.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "The project was developed by a larger professional team. The work shown here is contextualized around my specific programming and form-development contribution.",
        ],
      },
    ],
  },
  {
    slug: "foshan-jinzhu-residential-area",
    title: "COLI Foshan Jinzhu Residential Area",
    subtitle: "High-rise residential development",
    category: "Architecture Practice",
    period: "2017 internship / Later completed",
    location: "Foshan, China",
    role: "Architectural intern — facade research and planning support",
    status: "Completed / Professional team project",
    excerpt:
      "A commercial high-rise residential project developed through coordinated planning, facade studies and client presentations.",
    statement:
      "My early professional contribution centred on turning client preferences into facade directions and planning material.",
    accent: "#c9a69e",
    cover: "/media/architecture-practice/foshan-jinzhu.webp",
    coverAlt: "Entrance rendering at COLI Foshan Jinzhu Residential Area",
    facts: [
      { label: "Type", value: "Residential" },
      { label: "Contribution", value: "Mood boards and facade studies" },
      { label: "Support", value: "Planning application" },
      { label: "Status", value: "Completed" },
    ],
    sections: [
      {
        label: "01 / Project",
        title: "A commercial residential development",
        body: [
          "The Foshan project combines high-rise housing, landscape and a clearly defined arrival sequence. Unit planning and facade identity support its position in the residential market.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "Communicating a facade direction",
        body: [
          "During my internship, I prepared mood boards to explore client preferences and assisted the project architect with planning-application material. The work connected precedent research, visual communication and technical requirements.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "This was a completed team project. The case study identifies my internship contribution rather than claiming authorship of the overall design.",
        ],
      },
    ],
  },
  {
    slug: "chongqing-tianan-cyber-park-t3",
    title: "Chongqing Tianan Cyber Park T3",
    subtitle: "Feasibility and early design communication",
    category: "Architecture Practice",
    period: "2018–2020",
    location: "Chongqing, China",
    role: "Architectural assistant — site study, feasibility and diagrams",
    status: "Professional team project",
    excerpt:
      "An early-stage workplace project supported by site investigation, feasibility research and concise design communication.",
    statement:
      "The work focused on making an early project brief legible enough for the team to make confident design decisions.",
    accent: "#9eb0a0",
    cover: "/media/architecture-practice/chongqing-tianan.webp",
    coverAlt: "Aerial concept image for Chongqing Tianan Cyber Park T3",
    containCover: true,
    facts: [
      { label: "Type", value: "Workplace / Technology park" },
      { label: "Contribution", value: "Site visit and feasibility study" },
      { label: "Output", value: "Brief and diagrams" },
      { label: "Tools", value: "InDesign / Illustrator" },
    ],
    sections: [
      {
        label: "01 / Beginning",
        title: "Understanding the site before fixing the form",
        body: [
          "The project began with a site visit and feasibility study undertaken with senior architects. The aim was to identify spatial opportunities, constraints and a credible path for development.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "A brief the team could work with",
        body: [
          "I helped produce the design brief and explanatory diagrams in InDesign and Illustrator. The material condensed site findings into an accessible visual document for further design work.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "The portfolio currently contains limited public imagery for this project. The page therefore emphasizes the verified scope of my contribution rather than inventing a fuller visual record.",
        ],
      },
    ],
  },
  {
    slug: "dongguan-songshanhu-office-tower",
    title: "Dongguan Songshanhu Office Tower",
    subtitle: "Technical documentation and precedent research",
    category: "Architecture Practice",
    period: "2018–2020",
    location: "Dongguan, China",
    role: "Architectural assistant — basement drawings and precedent studies",
    status: "Professional team project",
    excerpt:
      "An office tower contribution combining basement documentation with focused precedent research for the project team.",
    statement:
      "Technical drawing and design research were treated as two parts of the same architectural decision process.",
    accent: "#8b9aa5",
    cover: "/media/architecture-practice/dongguan-songshanhu.webp",
    coverAlt: "Concept rendering of Dongguan Songshanhu Office Tower",
    containCover: true,
    facts: [
      { label: "Type", value: "Office" },
      { label: "Contribution", value: "Basement technical drawings" },
      { label: "Research", value: "Precedent studies" },
      { label: "Tools", value: "AutoCAD" },
    ],
    sections: [
      {
        label: "01 / Scope",
        title: "Documentation and research",
        body: [
          "The office-tower project required coordinated basement documentation alongside design research that could inform decisions above ground.",
        ],
      },
      {
        label: "02 / Contribution",
        title: "Two scales of architectural work",
        body: [
          "Under the project architect, I completed basement technical drawings in AutoCAD. I also researched relevant precedents and presented selected findings to colleagues.",
        ],
      },
      {
        label: "03 / Credit",
        title: "Professional team work",
        body: [
          "The case study records a supporting professional role. Additional team and project credits will be added when archival material is consolidated.",
        ],
      },
    ],
  },
  {
    slug: "family-tree-database",
    title: "Family Tree Database",
    subtitle: "A relational model for people, events and history",
    category: "Software",
    period: "Selected database project",
    role: "Data modelling and SQL implementation",
    status: "Repository available",
    excerpt:
      "A normalized relational model for family relationships, education, employment, addresses, marriages and life events.",
    statement:
      "The project turns an intuitive but complicated human network into explicit, queryable relationships.",
    accent: "#665b8e",
    facts: [
      { label: "Model", value: "EER / Relational" },
      { label: "Databases", value: "MySQL / SQL Server" },
      { label: "Focus", value: "Normalization" },
      { label: "Domain", value: "People and life events" },
    ],
    sections: [
      {
        label: "01 / Domain",
        title: "More than a parent-child tree",
        body: [
          "A useful family-history model must represent people, marriages, addresses, education, employment, achievements and events without flattening them into one oversized table.",
        ],
      },
      {
        label: "02 / Model",
        title: "Relationships made explicit",
        body: [
          "An enhanced entity-relationship model identifies stable entities and resolves many-to-many relationships through associative structures. Normalization reduces duplication and protects data integrity.",
        ],
      },
      {
        label: "03 / Implementation",
        title: "One model, two SQL environments",
        body: [
          "The schema is implemented for MySQL and Microsoft SQL Server, demonstrating how a conceptual model is translated across related database systems.",
        ],
      },
    ],
    links: [
      { label: "View repository", href: "https://github.com/HanZ14c/Family-Tree-Database" },
    ],
  },
  {
    slug: "architectural-hand-sketches",
    title: "Architectural Hand Sketches",
    subtitle: "Three studies of structure, mass and landscape",
    category: "Visual Studies",
    period: "Selected studies",
    role: "Drawing",
    status: "Ongoing visual archive",
    excerpt:
      "A small series of hand-drawn architectural studies exploring contour, structure, material weight and landscape setting.",
    statement:
      "Drawing is used here as a way to slow down observation and understand how a building holds together visually.",
    accent: "#898780",
    cover: "/media/architecture-practice/architectural-sketches.webp",
    coverAlt: "Three architectural hand sketches",
    cardSize: "wide",
    facts: [
      { label: "Medium", value: "Hand drawing" },
      { label: "Works", value: "Three studies" },
      { label: "Focus", value: "Structure / Mass / Landscape" },
      { label: "Archive", value: "More work to be added" },
    ],
    sections: [
      {
        label: "01 / Observation",
        title: "Understanding through line",
        body: [
          "The studies simplify complex buildings into dominant contours, structural rhythms and tonal relationships. Each drawing looks for the few lines that make the subject recognizable.",
        ],
      },
      {
        label: "02 / Practice",
        title: "A visual discipline beyond presentation",
        body: [
          "Hand drawing complements digital modelling and rendering by making proportion, hierarchy and composition immediate. The series will expand as paintings and additional sketch material are prepared for the site.",
        ],
      },
    ],
  },
];

export const categories: Array<"All" | ProjectCategory> = [
  "All",
  "Software",
  "Academic Architecture",
  "Architecture Practice",
  "Visual Studies",
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(project: Project, limit = 3) {
  return projects
    .filter(
      (candidate) =>
        candidate.slug !== project.slug && candidate.category === project.category,
    )
    .slice(0, limit);
}
