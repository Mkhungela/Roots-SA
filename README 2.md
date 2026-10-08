# ROOTS SA

A living archive of South African culture, heritage and language — built like the apps young
people already use, with an oral-history archive underneath it.

Most of South Africa's history was never written down. It was said out loud, and the people who
can still say it are old. Real oral-history collections exist in universities and museums, but
they are catalogued in English, locked behind institutional access and built for researchers. A
sixteen-year-old in Soweto is never going to open a finding aid. So this is vertical video, a save
button, XP and a game you can actually play — with the archive behind it, and a record button so
the archive grows.

## The eight sections

| | Section | What is in it |
|---|---|---|
| 🎮 | **Indigenous Games** (`/games`) | 10 games with rules, regional variations and challenges. **Morabaraba is fully playable** against a minimax opponent (easy / medium / hard) on the real 24-point Twelve Men's Morris board, diagonals included. **Diketo** is a playable two-tap timing game. |
| 🗣️ | **Languages** (`/languages`) | All 12 official languages with Census 2022 home-language shares. Flashcards, phrases, proverbs, idioms, slang, a three-click pronunciation trainer and a speaker button on every entry. |
| 👵🏾 | **Stories** (`/stories`) | Gogo and mkhulu stories, childhood memories, township and village history. Three have audio. |
| 🎤 | **Poetry** (`/poetry`) | Izibongo, dithoko, riddles, spoken word — plus two open challenges you can record an entry for. |
| 🍲 | **Food** (`/food`) | 14 recipes written down properly, each with the story of where the dish came from. |
| 👗 | **Culture** (`/culture`) | 30 entries across clothing, ceremony, marriage, music, dance, craft and traditional homes. |
| 🗺️ | **Heritage Map** (`/map`) | 22 places on a hand-built interactive SVG map of South Africa. Pan, zoom, filter by kind, tap a pin for what happened there, who was there and what the name means. |
| 📹 | **Feed** (`/feed`) | Full-screen vertical snap scroller with like, comment, save and share. Every post links back to the archive entry it belongs to. |

Plus **Today in ROOTS** on the home page (a daily rotating pick from every section),
**`/contribute`** (record in the browser), **`/saved`** (your saves, XP and level) and **`/about`**.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build      # production build (103 static pages)
npm run typecheck  # tsc --noEmit
npm run build:map  # regenerate src/content/za-map.ts from scripts/za-provinces.geo.json
```

## Data

The app runs with **no configuration at all** on a bundled seed archive held in `src/content/`.
Everything a user does — likes, saves, learned ticks, XP, recordings — is kept in `localStorage`
under `roots-sa:v1`.

Add Supabase credentials and the same store transparently mirrors to Postgres instead:

```bash
cp .env.example .env.local
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

`supabase/migrations/0001_init.sql` has the full schema: enums, tables, count triggers,
`handle_new_user()`, row-level security, the `media` and `avatars` storage buckets and a
`feed_posts` view. `src/lib/supabase/config.ts` exports `isSupabaseConfigured`; when it is false
`createClient()` returns `null` and every write stays local.

## What is real and what is illustrative

This matters, so it is stated in the app as well as here.

**Real and researched** — the heritage places and what happened at them, the languages and their
Census 2022 shares, the rules and origins of the games, the meaning of garments and ceremonies, the
recipes, and the background to the poetry traditions. Where a practice is contested (deaths at
illegal initiation schools, lobola and commodification, consent and the Reed Dance, Bo-Kaap
gentrification, the two separate museums at Ncome and Blood River) the disagreement is written in
rather than smoothed over.

**Illustrative** — the individual personal testimonies: gogo stories, the community voices on map
pins, the feed posts and the sample poems. These are written examples, not recorded oral history
from named real people. Every one carries a *Sample archive entry* chip. The audio on three stories
and one poetry entry is machine-read and labelled *Sample · machine-read*. They are meant to be
replaced, one by one, by real recordings. That replacement is the entire point of the project.

**Deliberately absent** — initiation content beyond what is already public, clan secrets and
anything restricted to a ceremony. The contribution form asks you to confirm this before publishing.
Living poets are written *about*, never reproduced; traditional izibongo appear only as short,
widely published excerpts.

## Notes on how it is built

- **Next.js 15 App Router / React 19 / TypeScript / Tailwind v4** (CSS-first `@theme`).
- **No network at runtime.** The map is hand-built SVG from public-domain Natural Earth province
  geometry, not a tile server. Fonts are self-hosted via `@fontsource-variable/*`, not
  `next/font/google`. Per-entry cover art is generated deterministically from each slug by
  `src/components/Pattern.tsx`, so there are no stock photographs pretending to be documentary.
- **The map projection** is equidistant-cylindrical, fitted to the four national extreme points:
  `x = 660.164402·lng − 11859.166532`, `gridY = 751.949513·lat + 26487.882982`,
  `screenY = 10146 − gridY`. Roughly 149 m per map unit. The `crs` / `hc-transform` metadata in the
  source geometry does *not* describe its actual coordinate space — do not try to use it.
- **Morabaraba** is real Twelve Men's Morris: 24 points, 20 mills (8 horizontal, 8 vertical,
  4 diagonal), placing → moving → flying at three cows. The engine is minimax with alpha-beta at
  depth 2 (medium) and 4 (hard); easy plays weighted-random.
- No analytics, no trackers, no third-party scripts.

```
src/
  app/              routes — one folder per section, server components + metadata
  components/
    games/          Morabaraba, Diketo
    sections/       the client-side explorers, map, feed, contribute, saved board
    ui.tsx          Chip, SaveButton, ArtCard, PageHeader, Section, FilterRow, LearnedTick…
    Pattern.tsx     deterministic SSR-safe generated cover art
  content/          the seed archive (games, languages, stories, poetry, food, culture,
                    heritage, feed) + za-map.ts + the search / daily-pick index
  lib/              types, the store, speech synthesis helpers, Supabase clients
supabase/migrations/
scripts/            build-map.mjs + the source province geometry
```

---

*Indlela ibuzwa kwabaphambili* — the way is asked from those who have gone ahead.
