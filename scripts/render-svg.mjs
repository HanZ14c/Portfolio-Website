import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const [source, output, widthValue = "512", heightValue = widthValue] = process.argv.slice(2);
const width = Number.parseInt(widthValue, 10);
const height = Number.parseInt(heightValue, 10);

if (!source || !output || !Number.isFinite(width) || !Number.isFinite(height)) {
  throw new Error("Usage: node scripts/render-svg.mjs <source.svg> <output.png> [width] [height]");
}

const svg = await readFile(source, "utf8");
const encoded = Buffer.from(svg).toString("base64");
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <style>
          html, body { margin: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
          img { display: block; width: ${width}px; height: ${height}px; }
        </style>
      </head>
      <body><img src="data:image/svg+xml;base64,${encoded}" alt=""></body>
    </html>
  `);
  await page.screenshot({ path: output, type: "png" });
} finally {
  await browser.close();
}
