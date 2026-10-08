import puppeteer from "puppeteer-core";
import fs from "node:fs";

const pages = process.argv[2]?.split(",") ?? ["/"];
const w = +(process.argv[3] ?? 1280), h = +(process.argv[4] ?? 900);
const full = process.argv[5] === "full";

const browser = await puppeteer.launch({
  executablePath: "/tmp/chromium",
  headless: "shell",
  args: ["--no-sandbox","--disable-setuid-sandbox","--disable-gpu","--disable-dev-shm-usage",
         "--font-render-hinting=none","--force-color-profile=srgb","--hide-scrollbars"],
});
fs.mkdirSync("/tmp/shots", { recursive: true });
for (const p of pages) {
  const page = await browser.newPage();
  const errs = [];
  page.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0,300)); });
  page.on("pageerror", e => errs.push("PAGEERROR " + String(e).slice(0,300)));
  page.on("requestfailed", r => errs.push("REQFAIL " + r.url().slice(0,160) + " " + r.failure()?.errorText));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  try {
    await page.goto("http://localhost:3000" + p, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForFunction(() => document.querySelectorAll("*").length > 50, { timeout: 60000 }).catch(()=>{});
  } catch (e) { errs.push("NAV " + String(e).slice(0,200)); }
  await new Promise(r => setTimeout(r, 2500));
  const name = (p === "/" ? "home" : p.replace(/[\/?=&]/g, "_").replace(/^_/, "")) + `_${w}`;
  await page.screenshot({ path: `/tmp/shots/${name}.png`, fullPage: full });
  const nodes = await page.evaluate(() => document.querySelectorAll("*").length);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(`shot ${name}  nodes=${nodes} bg=${bg}`);
  if (errs.length) console.log("  ERRORS:\n   " + [...new Set(errs)].slice(0,8).join("\n   "));
  await page.close();
}
await browser.close();
