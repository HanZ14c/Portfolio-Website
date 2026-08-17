# Han Zhang — Portfolio Website

An editorial portfolio for Han Zhang, bringing software engineering, architectural design, professional practice, academic work and visual studies into one coherent body of work.

The site is intentionally organized like a small publication: a concise home page introduces the overall practice, the project index provides a filterable overview, and every selected project has its own permanent detail page.

## Portfolio structure

- `/` — introduction and selected work
- `/work` — complete, filterable project index
- `/work/[slug]` — an individual case-study page for every project
- `/about` — background, education, experience and working approach
- `/Han-Zhang-Resume.pdf` — current résumé for viewing or download

## Included projects

### Computer Science

- **Team Workflow Scheduler** — Java/JavaFX collaboration system with TCP networking, JSON persistence and JUnit testing
- **Car Dealership Manager** — Java/Swing inventory application with UML-led design, JSON storage and tests
- **BC Travel Guide** — full-stack travel guide built with HTML, CSS, JavaScript, PHP and MySQL
- **Grid Pursuit Cheese** — browser game built with JavaScript and Canvas
- **Family Tree Database** — relational data model and database implementation using MySQL and SQL Server

### Academic architecture

- **Vertical City Housing** — 2018 graduation project for the Xi'an Poly Qujiang Spring residential community, exploring shared circulation and three-dimensional neighbourhood life
- **Feeling in Form** — revised cultural-space proposal in Xi'an Beilin that translates emotion, event and movement into spatial sequences
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

- **Bungalow** — Lumion 9 direct-render study of weather and seasonal atmosphere
- **Rumah** — residential visualization rendered in Lumion 8 and refined in Adobe Photoshop
- **Architectural Hand Sketches** — selected architectural hand drawings

## Background represented

- Bachelor of Computer Science, University of British Columbia, 2025–expected 2028
- Computer Studies, Langara College, 2023–2025
- Bachelor of Engineering in Architecture, Xi'an University of Technology, 2018
- Architectural design experience at Hong Kong Huayi Design Consultant (Shenzhen), 2017–2020

## Design direction

The visual system uses a white ground, soft charcoal typography, restrained blue navigation states and short orange accents. Architectural drawings remain the visual centre of their case studies, while computer-science projects use either real interface material or typographic covers. Motion is deliberately light and respects `prefers-reduced-motion`.

## Technology

- Next.js-compatible file routing through [vinext](https://github.com/cloudflare/vinext)
- React and TypeScript for reusable project templates and filtering
- Plain CSS for the complete visual system and responsive layout
- Small, framework-free browser JavaScript for reveal effects
- Static WebP project media prepared from the original portfolio material
- Cloudflare Workers for production hosting

Project records live in `lib/projects.ts`, with shared types, project-index helpers, featured-project configuration and site metadata split into focused modules under `lib/`.

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
pnpm test:browser
```

`pnpm test` builds and checks server-rendered routes. `pnpm test:browser` verifies filtering, sorting, navigation, selective case-study content and responsive overflow in desktop and mobile Chromium.

## Cloudflare Web Analytics

The production layout includes Cloudflare's privacy-first Web Analytics beacon only when a site token is configured. Local development never loads the beacon.

1. Add the site in **Cloudflare Dashboard → Analytics & Logs → Web Analytics**.
2. Copy its site token.
3. Add `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` as a production build variable in Cloudflare.

For a local production-build check, copy `.env.example` to `.env.local` and add the token. The token is public by design, but it should still be managed as deployment configuration rather than hard-coded into the component.

## Portfolio Guide

The bottom-right Portfolio Guide answers questions from the published project records, profile and résumé information. Its default local mode is deterministic: it does not call an external model, transmit chat content or require an API key.

To enable generated answers on Cloudflare later, add a Workers AI binding and an explicit production flag to `wrangler.jsonc`:

```jsonc
"ai": {
  "binding": "AI"
},
"vars": {
  "PORTFOLIO_CHAT_AI_ENABLED": "true"
}
```

With both values present, the Worker uses the same curated portfolio context for Workers AI and falls back to deterministic answers if inference is unavailable. The endpoint limits message length, recent history and request frequency, does not cache responses, and never renders model output as HTML.

## Deployment

The private GitHub repository is the source of truth. Cloudflare Workers can build and publish the site automatically whenever `main` changes.

Production is served from [zhang-han.com](https://zhang-han.com). The `www` hostname and the legacy `portfolio.hanz14c.workers.dev` address permanently redirect to the canonical domain while preserving paths and query parameters.

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

The publication-style portfolio currently includes responsive layouts, 18 independent project pages, selective long-form case studies, project discovery metadata, a résumé and desktop/mobile browser regression tests.

## Contact

- GitHub: [github.com/HanZ14c](https://github.com/HanZ14c)
- LinkedIn: [linkedin.com/in/hanz14c](https://linkedin.com/in/hanz14c)
- Email: [hanz14c@gmail.com](mailto:hanz14c@gmail.com)
