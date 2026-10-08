/**
 * End-to-end validation of the content layer and every internal link.
 * Runs against the real modules via the dev server's own data, parsed from source.
 */
import fs from "node:fs";

let fails = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fails++; console.log("  ✗ " + msg); } };

const read = (f) => fs.readFileSync(f, "utf8");
const slugs = (f, re = /slug: "([a-z0-9-]+)"/g) => [...read(f).matchAll(re)].map(m => m[1]);

// ---------- 1. no duplicate slugs anywhere ----------
console.log("\n[1] duplicate slugs");
for (const f of ["games","stories","poetry","food","culture","heritage"]) {
  const s = slugs(`src/content/${f}.ts`);
  const dupes = s.filter((x,i) => s.indexOf(x) !== i);
  ok(dupes.length === 0, `${f}.ts has duplicate slugs: ${[...new Set(dupes)].join(", ")}`);
}
const codes = [...read("src/content/languages.ts").matchAll(/^  {\n    code: "(\w+)"/gm)].map(m=>m[1]);

// ---------- 2. every internal href resolves ----------
console.log("\n[2] cross-references");
const all = {
  games: slugs("src/content/games.ts"),
  stories: slugs("src/content/stories.ts"),
  poetry: slugs("src/content/poetry.ts"),
  food: slugs("src/content/food.ts"),
  culture: slugs("src/content/culture.ts"),
  map: slugs("src/content/heritage.ts"),
  languages: [...read("src/content/languages.ts").matchAll(/code: "(\w{3,4})"/g)].map(m=>m[1]),
};
const feed = read("src/content/feed.ts");
const links = [...feed.matchAll(/link: \{ section: "(\w+)", slug: "([a-z0-9-]+)"/g)];
ok(links.length > 0, "feed has no links at all");
for (const [, section, slug] of links) {
  ok(all[section]?.includes(slug), `feed link -> ${section}/${slug} does not exist`);
}

// ---------- 3. audio files referenced actually exist ----------
console.log("\n[3] audio files");
const refs = new Set();
for (const f of ["stories","poetry","feed"]) {
  for (const m of read(`src/content/${f}.ts`).matchAll(/"(\/audio\/[\w.-]+)"/g)) refs.add(m[1]);
}
ok(refs.size > 0, "no audio referenced");
for (const r of refs) ok(fs.existsSync("public" + r), `missing audio file public${r}`);
console.log(`  (${refs.size} audio refs checked)`);

// ---------- 4. every lat/lng is inside South Africa ----------
console.log("\n[4] map coordinates");
const places = [...read("src/content/heritage.ts").matchAll(/lat: (-?[\d.]+),\s*\n\s*lng: (-?[\d.]+)/g)];
ok(places.length === all.map.length, `coordinate count ${places.length} != place count ${all.map.length}`);
for (const [i, [, lat, lng]] of places.entries()) {
  const la = +lat, ln = +lng;
  ok(la > -35.0 && la < -22.0, `place ${all.map[i]} lat ${la} outside SA`);
  ok(ln > 16.0 && ln < 33.1, `place ${all.map[i]} lng ${ln} outside SA`);
}

// ---------- 5. no placeholder text shipped ----------
console.log("\n[5] placeholder / TODO text");
for (const f of fs.readdirSync("src/content")) {
  if (!f.endsWith(".ts")) continue;
  const s = read("src/content/" + f);
  ok(!/\bTODO\b|\bFIXME\b|Lorem ipsum|placeholder text/i.test(s), `${f} contains TODO/placeholder`);
}

// ---------- 6. seeded entries are labelled ----------
console.log("\n[6] integrity labelling");
const feedCode = feed.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const posts = (feedCode.match(/seeded: true/g) || []).length;
const ids = (feedCode.match(/^    id: "/gm) || []).length;
ok(posts === ids, `feed: ${ids} posts but only ${posts} marked seeded:true`);

// ---------- 7. every route file has metadata ----------
console.log("\n[7] page metadata");
const walk = (d) => fs.readdirSync(d, {withFileTypes:true}).flatMap(e =>
  e.isDirectory() ? walk(`${d}/${e.name}`) : e.name === "page.tsx" ? [`${d}/${e.name}`] : []);
for (const f of walk("src/app")) {
  const s = read(f);
  ok(/export const metadata|export async function generateMetadata/.test(s), `${f} has no metadata export`);
}

// ---------- 8. the store never persists a blob: URL ----------
console.log("\n[8] recording persistence");
const store = read("src/lib/store.tsx");
ok(!/mediaUrl: blobUrl/.test(read("src/components/sections/Contribute.tsx")), "Contribute still persists a blob: URL");
ok(/putMedia/.test(store), "store does not write recordings to IndexedDB");
ok(/deleteMedia/.test(store), "store does not delete recordings on removePost");
ok(/clearMedia/.test(store), "store cannot clear recordings");
ok(/startsWith\("blob:"\)/.test(store), "store does not purge legacy blob: URLs on hydrate");

// ---------- 9. schema columns used by the client exist in the migration ----------
console.log("\n[9] supabase schema agreement");
const mig = read("supabase/migrations/0001_init.sql");
const inserted = [...store.matchAll(/^\s{8}(\w+):/gm)].map(m => m[1])
  .filter(c => c === c.toLowerCase() && c.includes("_"));
for (const col of new Set(inserted)) {
  ok(new RegExp(`\\b${col}\\b`).test(mig), `client writes column "${col}" that is not in the migration`);
}
console.log(`  (${new Set(inserted).size} columns checked)`);

console.log(`\n${fails === 0 ? "PASS" : "FAIL"} — ${checks - fails}/${checks} checks passed\n`);
process.exit(fails ? 1 : 0);
