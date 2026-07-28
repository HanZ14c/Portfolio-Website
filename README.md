# Han Zhang — Portfolio Website

An editorial portfolio for Han Zhang, bringing software engineering, architectural design, professional practice, academic work and visual studies into one coherent body of work.

The site is intentionally organized like a small publication: a concise home page introduces the overall practice, the project index provides a filterable overview, and every selected project has its own permanent detail page.

## Portfolio structure

- `/` — introduction and selected work
- `/work` — complete, filterable project index
- `/work/[slug]` — an individual case-study page for every project
- `/about` — background, education, experience and working approach

## Included projects

### Software

- **Team Workflow Scheduler** — Java/JavaFX collaboration system with TCP networking, JSON persistence and JUnit testing
- **Car Dealership Manager** — Java/Swing inventory application with UML-led design, JSON storage and tests
- **BC Travel Guide** — full-stack travel guide built with HTML, CSS, JavaScript, PHP and MySQL
- **Grid Pursuit Cheese** — browser game built with JavaScript and Canvas
- **Family Tree Database** — relational data model and database implementation using MySQL and SQL Server

### Academic architecture

- **Vertical City Housing** — 2018 graduation project for the Xi'an Poly Qujiang Spring residential community, exploring shared circulation and three-dimensional neighbourhood life
- **Emotion Time** — revised cultural-space proposal in Xi'an Beilin that translates emotion, event and movement into spatial sequences
- **MIRRIEDGE — The Gleam Within** — opera-house proposal structured around light, reflection, layered circulation and performance

### Architecture practice

- **CM Qianhai Shimao Centre** — basement technical coordination across civil defence, fire and MEP systems
- **Shenzhen Junior High School** — programme studies and formal exploration
- **Jiangmen Heshan Ocean World** — hotel and retail massing and facade studies
- **Guangzhou Najin Business Area** — planning diagrams and Rhino form development
- **COLI Foshan Jinzhu Residential Area** — early planning, mood boards and application material
- **Chongqing Tianan Cyber Park T3** — site research, feasibility studies and presentation diagrams
- **Dongguan Songshanhu Office Tower** — basement technical drawings and precedent research

### Visual studies

- **Architectural Hand Sketches** — three observational building studies

## Background represented

- Bachelor of Computer Science, University of British Columbia, 2025–expected 2028
- Computer Studies, Langara College, 2023–2025
- Bachelor of Engineering in Architecture, Xi'an University of Technology, 2018
- Architectural design experience at Hong Kong Huayi Design Consultant (Shenzhen), 2017–2020

## Design direction

The visual system uses warm paper tones, black typography, restrained red accents, oversized titles and asymmetrical image layouts. Architectural drawings remain the visual centre of their case studies, while software projects use typographic covers instead of invented interface screenshots. Motion is deliberately light and respects `prefers-reduced-motion`.

## Technology

- Next.js-compatible file routing through [vinext](https://github.com/cloudflare/vinext)
- React and TypeScript for reusable project templates and filtering
- Plain CSS for the complete visual system and responsive layout
- Small, framework-free browser JavaScript for reveal effects
- Static WebP project media prepared from the original portfolio material
- Cloudflare Workers for production hosting

The project data lives in `lib/projects.ts`; adding a record there creates an entry that can use the shared project-detail structure.

## Local development

Requires Node.js `>=22.13.0` and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm build
pnpm test
```

`pnpm test` builds the site and checks that the home page and project index render as finished portfolio pages.

## Deployment

The private GitHub repository is the source of truth. Cloudflare Workers can build and publish the site automatically whenever `main` changes.

In Cloudflare, choose **Workers & Pages → Import a repository**, authorize only this repository, and use:

- Production branch: `main`
- Build command: `pnpm build`
- Deploy command: `pnpm exec wrangler deploy`

For an authenticated local deployment, run:

```bash
pnpm deploy
```

The Cloudflare Worker and asset bindings are defined in `wrangler.jsonc`.

## Current status

The first publication-style version is implemented with responsive layouts and 16 independent project pages. Future additions can extend the same system with more architecture projects, painting, rendering and personal artwork as source material becomes available.

## Contact

- GitHub: [github.com/HanZ14c](https://github.com/HanZ14c)
- LinkedIn: [linkedin.com/in/hanz14c](https://linkedin.com/in/hanz14c)
- Email: [hanz14c@gmail.com](mailto:hanz14c@gmail.com)
