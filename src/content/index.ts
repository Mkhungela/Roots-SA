import { GAMES } from "./games";
import { LANGUAGES } from "./languages";
import { STORIES } from "./stories";
import { POEMS } from "./poetry";
import { RECIPES } from "./food";
import { CULTURE } from "./culture";
import { PLACES } from "./heritage";
import { POSTS } from "./feed";
import type { SectionId } from "@/lib/types";

export * from "./games";
export * from "./languages";
export * from "./stories";
export * from "./poetry";
export * from "./food";
export * from "./culture";
export * from "./heritage";
export * from "./feed";

export const SECTIONS: {
  id: SectionId;
  label: string;
  href: string;
  emoji: string;
  blurb: string;
  count: number;
  accent: string;
}[] = [
  { id: "games", label: "Indigenous Games", href: "/games", emoji: "🎮", blurb: "Learn them, watch them, play them.", count: GAMES.length, accent: "#f5a623" },
  { id: "languages", label: "Languages", href: "/languages", emoji: "🗣️", blurb: "Words, proverbs, slang, pronunciation.", count: LANGUAGES.length, accent: "#2fc4d6" },
  { id: "stories", label: "Stories", href: "/stories", emoji: "👵🏾", blurb: "Gogo and mkhulu, recorded.", count: STORIES.length, accent: "#e04524" },
  { id: "poetry", label: "Poetry", href: "/poetry", emoji: "🎤", blurb: "Izibongo and spoken word.", count: POEMS.length, accent: "#ec3b80" },
  { id: "food", label: "Food", href: "/food", emoji: "🍲", blurb: "Recipes and the stories behind them.", count: RECIPES.length, accent: "#22a35c" },
  { id: "culture", label: "Culture", href: "/culture", emoji: "👗", blurb: "Clothing, ceremony, music, craft.", count: CULTURE.length, accent: "#4a5ae0" },
  { id: "map", label: "Heritage Map", href: "/map", emoji: "🗺️", blurb: "Tap a place. Find out what happened.", count: PLACES.length, accent: "#ffc24d" },
  { id: "feed", label: "Feed", href: "/feed", emoji: "📹", blurb: "What people are posting right now.", count: POSTS.length, accent: "#ff5f9e" },
];

export const ARCHIVE_SIZE =
  GAMES.length + LANGUAGES.length + STORIES.length + POEMS.length +
  RECIPES.length + CULTURE.length + PLACES.length;

/* ------------------------------- search ------------------------------- */

export type SearchHit = {
  section: SectionId;
  slug: string;
  title: string;
  subtitle: string;
  haystack: string;
};

export const SEARCH_INDEX: SearchHit[] = [
  ...GAMES.map((g) => ({
    section: "games" as const, slug: g.slug, title: g.name, subtitle: g.tagline,
    haystack: [g.name, g.tagline, g.about, ...g.aka.map((a) => a.name), ...g.tags].join(" ").toLowerCase(),
  })),
  ...LANGUAGES.map((l) => ({
    section: "languages" as const, slug: l.code, title: l.name, subtitle: l.blurb.slice(0, 90) + "…",
    haystack: [l.name, l.endonym, l.blurb, ...l.words.map((w) => w.term + " " + w.meaning),
      ...l.proverbs.map((p) => p.text + " " + p.meaning), ...l.slang.map((s) => s.term + " " + s.meaning)].join(" ").toLowerCase(),
  })),
  ...STORIES.map((s) => ({
    section: "stories" as const, slug: s.slug, title: s.title, subtitle: `${s.teller} · ${s.place}`,
    haystack: [s.title, s.teller, s.place, s.summary, ...s.tags, ...s.body].join(" ").toLowerCase(),
  })),
  ...POEMS.map((p) => ({
    section: "poetry" as const, slug: p.slug, title: p.title, subtitle: p.poet,
    haystack: [p.title, p.poet, p.about, ...(p.tags ?? [])].join(" ").toLowerCase(),
  })),
  ...RECIPES.map((r) => ({
    section: "food" as const, slug: r.slug, title: r.name, subtitle: r.region,
    haystack: [r.name, ...r.aka, r.region, r.story, ...r.tags].join(" ").toLowerCase(),
  })),
  ...CULTURE.map((c) => ({
    section: "culture" as const, slug: c.slug, title: c.name, subtitle: c.oneLine,
    haystack: [c.name, c.people, c.oneLine, ...c.body, ...c.tags].join(" ").toLowerCase(),
  })),
  ...PLACES.map((p) => ({
    section: "map" as const, slug: p.slug, title: p.name, subtitle: p.era,
    haystack: [p.name, p.alsoKnown ?? "", p.era, p.whatHappened, ...p.detail,
      ...p.people.map((x) => x.name)].join(" ").toLowerCase(),
  })),
];

export function search(q: string, limit = 12): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  const terms = needle.split(/\s+/);
  return SEARCH_INDEX
    .map((hit) => {
      let score = 0;
      for (const t of terms) {
        if (hit.title.toLowerCase().includes(t)) score += 10;
        if (hit.subtitle.toLowerCase().includes(t)) score += 4;
        if (hit.haystack.includes(t)) score += 1;
      }
      return { hit, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.hit);
}

/* ------------------------- today's rotation --------------------------- */

/** Stable day index so "Today in ROOTS" changes daily but is identical for everyone. */
export function dayIndex(date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

const pick = <T,>(arr: T[], offset: number, day: number) => arr[(day + offset) % arr.length];

export function todayPicks(day = dayIndex()) {
  const game = pick(GAMES, 0, day);
  const language = pick(LANGUAGES, 1, day);
  const word = language.words[day % language.words.length];
  const proverb = language.proverbs[day % language.proverbs.length];
  const story = pick(STORIES, 2, day);
  const poem = pick(POEMS.filter((p) => p.kind !== "challenge"), 3, day);
  const recipe = pick(RECIPES, 4, day);
  const music = pick(CULTURE.filter((c) => c.kind === "music"), 5, day);
  const clothing = pick(CULTURE.filter((c) => c.kind === "clothing"), 6, day);
  const place = pick(PLACES, 7, day);
  return { game, language, word, proverb, story, poem, recipe, music, clothing, place };
}

/** Every item that can be saved, used to resolve the saved-items page. */
export function resolveRef(section: SectionId, slug: string): { title: string; subtitle: string; href: string } | null {
  switch (section) {
    case "games": {
      const g = GAMES.find((x) => x.slug === slug);
      return g ? { title: g.name, subtitle: g.tagline, href: `/games/${g.slug}` } : null;
    }
    case "languages": {
      const l = LANGUAGES.find((x) => x.code === slug);
      return l ? { title: l.name, subtitle: l.speakersNote, href: `/languages/${l.code}` } : null;
    }
    case "stories": {
      const s = STORIES.find((x) => x.slug === slug);
      return s ? { title: s.title, subtitle: `${s.teller} · ${s.place}`, href: `/stories/${s.slug}` } : null;
    }
    case "poetry": {
      const p = POEMS.find((x) => x.slug === slug);
      return p ? { title: p.title, subtitle: p.poet, href: `/poetry/${p.slug}` } : null;
    }
    case "food": {
      const r = RECIPES.find((x) => x.slug === slug);
      return r ? { title: r.name, subtitle: r.region, href: `/food/${r.slug}` } : null;
    }
    case "culture": {
      const c = CULTURE.find((x) => x.slug === slug);
      return c ? { title: c.name, subtitle: c.oneLine, href: `/culture/${c.slug}` } : null;
    }
    case "map": {
      const p = PLACES.find((x) => x.slug === slug);
      return p ? { title: p.name, subtitle: p.era, href: `/map?place=${p.slug}` } : null;
    }
    default:
      return null;
  }
}

export const PROVINCE_LABEL: Record<string, string> = {
  EC: "Eastern Cape", FS: "Free State", GP: "Gauteng", KZN: "KwaZulu-Natal",
  LP: "Limpopo", MP: "Mpumalanga", NC: "Northern Cape", NW: "North West",
  WC: "Western Cape", NAT: "Nationwide",
};
