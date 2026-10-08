"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Volume2 } from "lucide-react";
import type { todayPicks } from "@/content";
import { Pattern, seedColors } from "./Pattern";
import { clsx } from "./ui";
import { speak } from "@/lib/speak";

type Picks = ReturnType<typeof todayPicks>;

/**
 * "Today in ROOTS" — one rotating card per section, so the home page always opens on
 * something specific rather than a menu. The rotation is derived from the UTC date, so
 * it is identical for every visitor and stable between server and client render.
 */
export function TodayStrip({ picks }: { picks: Picks }) {
  const cards = [
    {
      key: "game", emoji: "🎮", kicker: "Learn a game", title: picks.game.name,
      line: picks.game.tagline, href: `/games/${picks.game.slug}`, seed: picks.game.slug,
      cta: picks.game.playable ? "Play it now" : "Learn the rules",
    },
    {
      key: "word", emoji: "🗣️", kicker: `Learn a word · ${picks.language.name}`, title: picks.word.term,
      line: picks.word.meaning, href: `/languages/${picks.language.code}`, seed: picks.language.code,
      say: picks.word.term,
    },
    {
      key: "story", emoji: "👵🏾", kicker: `${picks.story.teller} · ${picks.story.place}`, title: picks.story.title,
      line: picks.story.summary, href: `/stories/${picks.story.slug}`, seed: picks.story.slug,
      cta: `${picks.story.minutes} min listen`,
    },
    {
      key: "poem", emoji: "🎤", kicker: "Poetry", title: picks.poem.title,
      line: picks.poem.about, href: `/poetry/${picks.poem.slug}`, seed: picks.poem.slug,
    },
    {
      key: "food", emoji: "🍲", kicker: "How it's made", title: picks.recipe.name,
      line: picks.recipe.story, href: `/food/${picks.recipe.slug}`, seed: picks.recipe.slug,
      cta: picks.recipe.time,
    },
    {
      key: "music", emoji: "🥁", kicker: "Music", title: picks.music.name,
      line: picks.music.oneLine, href: `/culture/${picks.music.slug}`, seed: picks.music.slug,
    },
    {
      key: "cloth", emoji: "🧵", kicker: "What this garment means", title: picks.clothing.name,
      line: picks.clothing.oneLine, href: `/culture/${picks.clothing.slug}`, seed: picks.clothing.slug,
    },
    {
      key: "place", emoji: "📍", kicker: `Why this place matters · ${picks.place.era}`, title: picks.place.name,
      line: picks.place.whatHappened, href: `/map?place=${picks.place.slug}`, seed: picks.place.slug,
    },
  ];

  return (
    <section className="border-b border-soil-800 bg-soil-900/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-soil-100 sm:text-3xl">Today in ROOTS</h2>
            <p className="mt-1 text-sm text-soil-400">Eight things, changing every day.</p>
          </div>
          <div className="rounded-full border border-soil-700 bg-soil-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-soil-400">
            {new Date().toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
          </div>
        </div>

        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {cards.map(({ key, ...c }) => (
            <TodayCard key={key} {...c} />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-soil-800 bg-soil-900 p-4">
          <span className="text-lg">💬</span>
          <p className="flex-1 text-sm text-soil-300">
            <span className="font-semibold text-soil-100">{picks.proverb.text}</span>
            <span className="mx-2 text-soil-600">·</span>
            {picks.proverb.meaning}
          </p>
          <Link href={`/languages/${picks.language.code}`} className="inline-flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-widest text-sun-500 hover:text-sun-400">
            {picks.language.name} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TodayCard({
  emoji, kicker, title, line, href, seed, cta, say,
}: {
  emoji: string; kicker: string; title: string; line: string; href: string;
  seed: string; cta?: string; say?: string;
}) {
  const [c1] = seedColors(seed);
  const [spoke, setSpoke] = useState(false);
  return (
    <Link
      href={href}
      className="group relative flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-soil-800 bg-soil-900 transition hover:-translate-y-1 hover:border-soil-600 sm:w-auto"
    >
      <div className="relative h-24 overflow-hidden sm:h-28">
        <Pattern seed={seed} className="absolute inset-0 h-full w-full opacity-[0.62] transition duration-500 group-hover:opacity-80 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-900 to-transparent" />
        <span className="absolute left-3 top-3 text-2xl drop-shadow">{emoji}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: c1 }}>{kicker}</div>
        <h3 className="mt-1.5 font-display text-xl leading-tight text-soil-100">{title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-snug text-soil-400">{line}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-soil-500">{cta ?? "Open"}</span>
          {say ? (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); speak(say); setSpoke(true); setTimeout(() => setSpoke(false), 900); }}
              aria-label={`Hear ${say}`}
              className={clsx("rounded-full border border-soil-700 p-1.5 transition hover:border-sun-500 hover:text-sun-500", spoke ? "text-sun-500" : "text-soil-400")}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          ) : (
            <ArrowRight className="h-4 w-4 text-soil-600 transition group-hover:translate-x-1 group-hover:text-soil-300" />
          )}
        </div>
      </div>
    </Link>
  );
}
