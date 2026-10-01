# Portfolio-Website — 本地项目记忆

更新时间：2026-09-30（America/Vancouver）  
检查基准：本地 HEAD `5f936a2`（`Update resume PDF`）。

这份文件用于后续 Codex 会话快速了解项目。它是项目地图与历史背景，不是当前测试、远端同步或线上部署成功的证明；继续工作时应重新检查相关文件和 Git 状态。

## 项目定位与设计方向

- Han Zhang 的个人作品集，由 Codex 协助开发，整合 Computer Science、Academic Architecture、Architecture Practice、Visual Studies。
- 网站主体为英文，强调从建筑设计转向计算机科学的背景及真实作品资料。
- 采用建筑出版物式的 editorial 布局：白底、炭灰文字、蓝色导航与橙色小细节，12 栏网格，sans / serif / mono 字体组合。
- 历史偏好：用户觉得大面积深色 “View the full index” CTA 突兀，后续视觉修改应保持克制的层级和网格感。此偏好来自先前会话记录，并非本次新增要求。
- 首页保留一个主要项目和六个次要项目的层级；不要仅为统一版式而抹平作品间的差异。
- 不编造项目成果、职责、日期或未提供的作品材料。

## 技术与运行结构

- React `19.2.6`、TypeScript `5.9.3`；依赖包含 Next.js `16.2.6`，实际运行与构建命令使用 **vinext `0.0.50` + Vite `8.0.13`**。
- 使用 Next.js-compatible App Router 文件路由和 `next/link` 等 API；不要把它当成默认 `next build` / Vercel 项目操作。
- 主要视觉样式是普通 CSS；存在 Tailwind/PostCSS 依赖，不代表页面使用 Tailwind 作为主要样式系统。
- Cloudflare Workers 承载运行时；入口为 `worker/index.ts`，Vite 集成见 `vite.config.ts`。
- 内容保存在 TypeScript 项目记录和静态媒体中，未发现独立 CMS 或数据库内容层。
- Node 要求 `>=22.13.0`，包管理器为 pnpm，锁文件为 `pnpm-lock.yaml`。

## 页面与常用修改入口

| 内容 | 文件 / 路由 |
| --- | --- |
| 首页、简介、精选作品、背景时间线 | `app/page.tsx` → `/` |
| 完整项目索引外壳 | `app/work/page.tsx` → `/work` |
| 项目分类过滤、排序和分组 UI | `app/work/ProjectIndex.tsx` |
| 项目详情共用模板、metadata、前后项目导航 | `app/work/[slug]/page.tsx` → `/work/[slug]` |
| 完整个人背景和工作经历 | `app/about/page.tsx` → `/about` |
| 所有项目内容 | `lib/projects.ts` |
| 项目字段类型 | `lib/projects/types.ts` |
| 首页精选顺序 | `lib/featured-projects.ts` |
| 分类 / 标题 / 结束年份排序与分组 | `lib/project-index.ts` |
| 全站名称、域名、联系信息与 URL helpers | `lib/site.ts` |
| 页面卡片 | `app/components/ProjectCard.tsx` |
| 导航、移动菜单、简历操作、Guide 挂载 | `app/components/SiteHeader.tsx` |
| 页脚 | `app/components/SiteFooter.tsx` |
| 全站 metadata、JSON-LD、skip link、CSS 引入 | `app/layout.tsx` |
| 主布局及响应式样式 | `app/globals.css` |
| 颜色、尺寸、字体变量 | `app/styles/tokens.css` |
| 无障碍与 Guide 样式 | `app/styles/accessibility.css`、`app/styles/portfolio-guide.css` |
| 滚动 reveal 动画 | `app/components/ClientEffects.tsx` |
| sitemap / robots / manifest | `app/sitemap.ts`、`app/robots.ts`、`app/manifest.ts` |
| 项目媒体、社交图标、学校图标 | `public/media/` |
| 公共简历 PDF | `public/Han-Zhang-Resume.pdf` → `/Han-Zhang-Resume.pdf` |

注意：个人背景和联系信息也出现在首页、About 和 `lib/portfolio-guide.ts` 中，修改时检查这些入口，避免只更新一处。

## 项目数据与展示约定

- `projects` 共 18 条记录；`publicProjects = projects.filter(project => !project.hidden)`，目前公开 **16** 个。
- 隐藏项目：`chongqing-tianan-cyber-park-t3`、`dongguan-songshanhu-office-tower`。`getProject()` 仅查公开项目，隐藏项目详情应返回 404。
- README 的“18 independent project pages”及完整作品清单不等于当前公开集合。若更新公开数量，应从 `publicProjects` 和测试断言一起核对。
- 分类顺序：Computer Science → Academic Architecture → Architecture Practice → Visual Studies。
- 前后项目导航沿用分类顺序和类内原始记录顺序；不是用户临时选择的索引排序。
- `showSections: false` 用来保留资料但不显示长篇 narrative；当前五个 CS 项目采用此方式，不要因为数据中有 `sections` 就认定页面显示它们。
- `showGallery: false` 控制隐藏 gallery；`visualOnly: true` 用于手绘项目，以图片展示为主。
- 首页精选由 `featuredProjectSlugs` 决定，不是按记录中的 `featured` 字段筛选。

当前首页顺序（七个）：

1. `feeling-in-form` — Feeling in Form（主要项目）
2. `bc-travel-guide` — BC Travel Guide
3. `team-workflow-scheduler` — Team Workflow Scheduler
4. `qianhai-shimao-centre` — CM Qianhai Shimao Centre
5. `car-dealership-manager` — Car Dealership Manager
6. `grid-pursuit-cheese` — Grid Pursuit: Cheese
7. `architectural-hand-sketches` — Architectural Hand Sketches

首卡通过 `.project-grid--featured > .project-card:first-child` 获得主项目布局，其余六卡构成桌面两列三行。首页编号由精选数量派生；更新集合时同步检查 rendered-HTML 测试中的顺序断言。

## Portfolio Guide 与 Analytics

- Guide UI：`app/components/PortfolioGuide.tsx`，从 SiteHeader 挂载。
- 请求入口：Worker 的 `POST /api/portfolio-chat`；默认回答由 `lib/portfolio-guide.ts` 的规则及公开项目资料生成。
- 默认模式不调用外部模型；UI 仍会把最近对话发送到本网站的 Worker。不要将其描述为完全离线的聊天。
- 只有同时配置 Workers AI 的 `AI` binding 和 `PORTFOLIO_CHAT_AI_ENABLED="true"` 才启用模型；当前 `wrangler.jsonc` 没有启用这两项。模型失败时回退到规则回答。
- 当前请求校验：最后八条消息、每条最多 500 字符、总计最多 3,000 字符；按 IP 每分钟 20 次，计数 Map 仅在当前 Worker isolate 内有效。
- 保留 Guide 的 dialog 语义、焦点管理、Escape 关闭和普通文本渲染。
- Analytics：`CloudflareAnalytics.tsx` 仅在 production 且配置 `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` 时加载 beacon；开发模式不加载。
- `NEXT_PUBLIC_SITE_URL` 可覆盖 SEO 使用的网站 URL，但 Worker 的 canonical hostname 独立写在 `worker/index.ts`；改域名需同时检查。

## 开发与验证

```bash
pnpm install
pnpm dev              # 默认 localhost:3000
pnpm build
pnpm test             # build + Node rendered-HTML tests
pnpm test:browser     # Playwright desktop/mobile Chromium
pnpm test:all         # 上述两组测试
pnpm lint
```

- `tests/rendered-html.test.mjs` 当前有 19 个 test 定义，直接导入构建后的 `dist/server/index.js`，检查 SSR、项目可见性、Guide、SEO、重定向等。
- `tests/browser/portfolio.spec.ts` 当前有 7 个 test 定义；`playwright.config.ts` 配置 desktop 和 mobile 两个 Chromium 项目，自启 `pnpm run dev -- --port 4173`。
- 浏览器检查覆盖过滤 / 排序、导航、Guide、简历入口、移动菜单和横向溢出。
- 文档变更不需要重跑应用测试；页面 / 数据 / Worker 变更应运行对应检查，不能以旧的通过记录替代本次验证。
- `vite.config.ts` 在 `CODEX_SANDBOX=seatbelt` 时使用 polling；Wrangler / Miniflare 的日志与运行状态存放在项目 `.wrangler/`。
- 历史曾出现 PATH 找不到 Node。遇到时先检查实际 Node / pnpm 路径，必要时通过 Codex 的 workspace dependencies 工具定位 bundled runtime。
- `scripts/prepare_media.py` 依赖 Pillow 和本地 `tmp/pdfs/architecture-portfolio` 原始导出，不是每次构建都应运行的步骤；仓库中的已处理媒体可直接使用。

## 部署与继续工作的边界

- 配置文件：`wrangler.jsonc`；Worker 名称 `portfolio`，静态 assets 为 `dist/client`，具有 `ASSETS` 和 `IMAGES` bindings。
- 主域名配置为 `zhang-han.com`，同时配置 `www.zhang-han.com`。
- Worker 将 `www.zhang-han.com` 和旧地址 `portfolio.hanz14c.workers.dev` 以 308 重定向到 HTTPS 主域名，保留路径和查询参数。
- 本地部署命令：`pnpm deploy`（vinext deploy）。README 也描述了 Cloudflare 导入仓库后对 `main` 自动构建部署的流程；本次未确认后台是否仍开启。
- 当前 checkout 是 Codex worktree，检查时 HEAD 为 detached；修改完成后先核对分支和远端状态，再决定提交 / 推送位置，不默认当前位于 `main`。
- 发布前完成相关测试；发布后另查线上 HTML、资源及重定向。更新简历时，检查 PDF 内容与版式，并比较线上下载文件和本地文件的 hash。
- 环境变量放在忽略的 `.env*` 文件；`.env.example` 可跟踪。不要把凭据、Wrangler 状态或构建产物写进记忆或提交。
- 不为本次记忆任务执行 push / deploy。后续是否发布以当时用户请求为准。

## 本次检查与历史依据

- 本次阅读了 README、package/config、主要页面、项目数据及 helpers、Worker、Guide、样式变量和测试代码。
- 创建前工作区无未提交改动；本次只新增本文件。
- 本次未安装依赖、运行 build / tests、启动浏览器预览或验证线上部署；当前测试通过情况和生产版本均未确认。
- 历史记录显示 `9e4aa78` 曾完成首页七卡布局，并通过当时的 19 项 SSR 测试和移动端检查；Git 本地历史中仍可见此提交。历史发布成功不代表当前线上状态。
- 先前会话来源：Codex memory 中的 Portfolio Website homepage layout and production publish 记录（2026-09-01；会话 `01a05e13-46b3-7642-b372-12067040d24d`）。本文的文件地图、版本、可见数量及配置均重新查看了当前 checkout。
