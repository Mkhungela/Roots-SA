import puppeteer from "puppeteer-core";
import fs from "node:fs";
const [, , route, text, out] = process.argv;
const browser = await puppeteer.launch({
  executablePath: "/tmp/chromium", headless: "shell",
  args: ["--no-sandbox","--disable-setuid-sandbox","--disable-gpu","--disable-dev-shm-usage","--font-render-hinting=none","--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto("http://localhost:3000" + route, { waitUntil: "domcontentloaded", timeout: 120000 });
await new Promise(r => setTimeout(r, 2500));
const y = await page.evaluate((t) => {
  const el = [...document.querySelectorAll("h2,h1,h3")].find(e => e.textContent.trim().startsWith(t));
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.top + window.scrollY - 40;
}, text);
if (y === null) { console.log("NOT FOUND:", text); } else { await page.evaluate(v => window.scrollTo(0, v), y); }
await new Promise(r => setTimeout(r, 900));
fs.mkdirSync("/tmp/shots", { recursive: true });
await page.screenshot({ path: `/tmp/shots/${out}.png` });
console.log("shot", out, "at y=", y);
await browser.close();
