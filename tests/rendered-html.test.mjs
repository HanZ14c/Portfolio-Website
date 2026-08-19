import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function requestWorker(path, init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, init),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished portfolio home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Han Zhang — Computer Science, Architecture and Visual Work/);
  assert.match(html, /I design systems/);
  assert.match(html, /across code and space/);
  assert.match(html, /Selected work/);
  assert.match(html, /class="profile-links"/);
  assert.match(html, /Han-Zhang-Resume\.pdf/);
  assert.match(html, /aria-current="page"[^>]*>HZ/);
  assert.match(html, /media\/social\/email\.png/);
  assert.match(html, /media\/social\/linkedin\.png/);
  assert.match(html, /media\/social\/github\.png/);
  assert.match(html, /Langara College/);
  assert.match(html, /Ask about my work/);
  assert.match(html, /media\/institutions\/ubc\.jpeg/);
  assert.match(html, /media\/institutions\/langara\.jpeg/);
  assert.match(html, /media\/institutions\/huayi\.jpeg/);
  assert.match(html, /media\/institutions\/xaut\.jpeg/);
  assert.match(html, /href="https:\/\/zhang-han\.com\/favicon-hz\.png"/);
  assert.match(html, /href="https:\/\/zhang-han\.com\/favicon-hz-32\.png"/);
  assert.match(html, /href="https:\/\/zhang-han\.com\/favicon-hz-16\.png"/);
  assert.match(html, /rel="shortcut icon" href="https:\/\/zhang-han\.com\/favicon-hz\.ico"/);
  assert.match(html, /rel="apple-touch-icon" href="https:\/\/zhang-han\.com\/apple-touch-icon-hz\.png"/);
  const featuredTitles = [
    "Feeling in Form",
    "BC Travel Guide",
    "Team Workflow Scheduler",
    "CM Qianhai Shimao Centre",
    "Car Dealership Manager",
    "Grid Pursuit: Cheese",
    "Bungalow",
    "Architectural Hand Sketches",
    "Family Tree Database",
  ];
  const featuredPositions = featuredTitles.map((title) => html.indexOf(title));
  assert.ok(featuredPositions.every((position) => position >= 0));
  assert.deepEqual(featuredPositions, [...featuredPositions].sort((first, second) => first - second));
  assert.match(html, /2021/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("answers portfolio-guide questions from published project data", async () => {
  const response = await requestWorker("/api/portfolio-chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "Show me Java projects" }] }),
  });

  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  const result = await response.json();
  assert.equal(result.mode, "guide");
  assert.match(result.answer, /Java-related projects/);
  assert.ok(result.links.some((link) => link.href === "/work/team-workflow-scheduler"));
});

test("rejects malformed portfolio-guide requests", async () => {
  const response = await requestWorker("/api/portfolio-chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "" }] }),
  });

  assert.equal(response.status, 400);
});

test("server-renders the institutional background on the about page", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /University of British Columbia/);
  assert.match(html, /Langara College/);
  assert.match(html, /Hong Kong Huayi Design Consultant/);
  assert.match(html, /Xi(?:&#x27;|')an University of Technology/);
  assert.match(html, /Continue \+ connect/);
  assert.match(html, /media\/institutions\/(?:ubc|langara|huayi|xaut)\.jpeg/);
});

test("server-renders the project index", async () => {
  const response = await render("/work");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Complete project index/);
  assert.match(html, /Vertical City Housing/);
  assert.match(html, /Team Workflow Scheduler/);
  assert.match(html, /Computer Science/);
  assert.match(html, /Sort projects/);
  assert.match(html, /End time — newest first/);
  assert.match(html, /Projects grouped by category/);
  assert.match(html, /href="\/work" aria-current="page"/);
  assert.match(html, /2026/);
  assert.doesNotMatch(html, /XXXX/);
});

test("server-renders the Team Workflow Scheduler summary without its narrative", async () => {
  const response = await render("/work/team-workflow-scheduler");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /JUnit 5/);
  assert.match(html, /Team-Workflow-Scheduler/);
  assert.doesNotMatch(html, /class="project-sections page-shell"/);
  assert.doesNotMatch(html, /Thread-per-connection socket handling/);
  assert.match(html, /"@type":"CreativeWork"/);
});

test("selectively renders complete project narratives", async () => {
  const completeResponse = await render("/work/qianhai-shimao-centre");
  const completeHtml = await completeResponse.text();
  assert.match(completeHtml, /class="project-sections page-shell"/);
  assert.match(completeHtml, /Coordination below the public ground/);

  const computerSciencePaths = [
    "/work/team-workflow-scheduler",
    "/work/bc-travel-guide",
    "/work/car-dealership-manager",
    "/work/grid-pursuit-cheese",
    "/work/family-tree-database",
  ];

  for (const path of computerSciencePaths) {
    const conciseResponse = await render(path);
    const conciseHtml = await conciseResponse.text();
    assert.doesNotMatch(conciseHtml, /class="project-sections page-shell"/);
  }
});

test("renders previous and next project navigation in the default index order", async () => {
  const middleResponse = await render("/work/feeling-in-form");
  const middleHtml = await middleResponse.text();
  assert.match(middleHtml, /aria-label="Browse adjacent projects"/);
  assert.match(middleHtml, /href="\/work\/vertical-city-housing"[^>]*>[^]*Previous project/);
  assert.match(middleHtml, /href="\/work\/mirriedge-opera-house"[^>]*>[^]*Next project/);
  assert.match(middleHtml, /07(?:<!-- -->)? \/ (?:<!-- -->)?18/);

  const firstResponse = await render("/work/team-workflow-scheduler");
  const firstHtml = await firstResponse.text();
  assert.doesNotMatch(firstHtml, /Previous project/);
  assert.match(firstHtml, /href="\/work\/bc-travel-guide"[^>]*>[^]*Next project/);

  const lastResponse = await render("/work/architectural-hand-sketches");
  const lastHtml = await lastResponse.text();
  assert.match(lastHtml, /href="\/work\/rumah"[^>]*>[^]*Previous project/);
  assert.doesNotMatch(lastHtml, /Next project/);
});

test("publishes crawl and discovery metadata", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /zhang-han\.com\/work\/feeling-in-form/);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/zhang-han\.com\/sitemap\.xml/);
});

test("permanently redirects legacy and www hosts to the canonical domain", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-redirect`);
  const { default: worker } = await import(workerUrl.href);
  const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  for (const hostname of ["portfolio.hanz14c.workers.dev", "www.zhang-han.com"]) {
    const response = await worker.fetch(
      new Request(`https://${hostname}/work/feeling-in-form?from=legacy`),
      env,
      ctx,
    );

    assert.equal(response.status, 308);
    assert.equal(
      response.headers.get("location"),
      "https://zhang-han.com/work/feeling-in-form?from=legacy",
    );
  }
});

test("keeps analytics disabled when no production site token is configured", async () => {
  const response = await render();
  const html = await response.text();
  assert.doesNotMatch(html, /static\.cloudflareinsights\.com\/beacon\.min\.js/);
});

test("server-renders the Car Dealership Manager summary and gallery", async () => {
  const response = await render("/work/car-dealership-manager");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Java 11\+/);
  assert.match(html, /JUnit 5 \/ 39 tests/);
  assert.match(html, /uml-design-diagram\.png/);
  assert.match(html, /Car-Dealership-Manager/);
  assert.doesNotMatch(html, /singleton EventLog/);
  assert.doesNotMatch(html, /class="project-sections page-shell"/);
});

test("server-renders the Family Tree Database summary and gallery", async () => {
  const response = await render("/work/family-tree-database");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /13 tables/);
  assert.match(html, /MySQL \+ Microsoft SQL Server/);
  assert.match(html, /eer-modeling-diagram\.png/);
  assert.doesNotMatch(html, /Twenty SQL examples/);
  assert.doesNotMatch(html, /class="project-sections page-shell"/);
});

test("server-renders the BC Travel Guide technical case study", async () => {
  const response = await render("/work/bc-travel-guide");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Six destination stories/);
  assert.match(html, /PHP \/ PDO \/ MySQL/);
  assert.match(html, /photo-wall\.jpg/);
  assert.match(html, /BC-Travel-Guide/);
});

test("server-renders the Grid Pursuit Cheese technical case study", async () => {
  const response = await render("/work/grid-pursuit-cheese");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Five-action queue/);
  assert.match(html, /HTML5 Canvas API/);
  assert.match(html, /gameplay-interface\.png/);
  assert.match(html, /Grid-Pursuit-Cheese/);
});

test("server-renders the architectural sketches as a visual-only gallery", async () => {
  const response = await render("/work/architectural-hand-sketches");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Architectural Hand Sketches/);
  assert.match(html, /sketch-1\.jpg/);
  assert.match(html, /sketch-2\.jpg/);
  assert.match(html, /sketch-3\.jpg/);
  assert.doesNotMatch(html, /<section class="project-cover/);
  assert.doesNotMatch(html, /Three studies|Project premise|Drawings, systems and outcomes/);
});

test("server-renders the Rumah visualization workflow", async () => {
  const response = await render("/work/rumah");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Rumah/);
  assert.match(html, /Lumion 8 \+ Adobe Photoshop/);
  assert.match(html, /project-gallery__triptych/);
  assert.match(html, /lumion-base\.jpg/);
  assert.match(html, /lumion-sky-alpha\.jpg/);
  assert.match(html, /lumion-material-id\.jpg/);
  assert.match(html, /rumah-final\.jpg/);
  assert.match(html, /Photoshop \/ Final image/);
});

test("server-renders the Bungalow Lumion weather study", async () => {
  const response = await render("/work/bungalow");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Bungalow/);
  assert.match(html, /Lumion 9/);
  assert.match(html, /Weather \+ seasonal atmosphere/);
  assert.match(html, /clear-weather\.jpg/);
  assert.match(html, /rain-weather\.jpg/);
  assert.match(html, /cold-snow-weather\.jpg/);
  assert.match(html, /winter-weather\.jpg/);
  assert.match(html, /One scene across changing atmospheric conditions/);
});
