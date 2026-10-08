"use client";

import Link from "next/link";
import { Bookmark, Flame, GraduationCap, Trash2, Trophy, Upload } from "lucide-react";
import { resolveRef, SECTIONS } from "@/content";
import { useStore } from "@/lib/store";
import { Chip } from "@/components/ui";
import { DataControls } from "@/components/sections/DataControls";
import { Pattern } from "@/components/Pattern";

const LEVELS = [
  { at: 0, name: "Visitor" },
  { at: 100, name: "Listener" },
  { at: 300, name: "Learner" },
  { at: 600, name: "Keeper" },
  { at: 1000, name: "Griot" },
  { at: 1800, name: "Imbongi" },
];

export function SavedBoard() {
  const { saves, posts, learned, xp, ready, toggleSave, removePost, live } = useStore();

  if (!ready) {
    return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-28 animate-pulse rounded-card bg-soil-900" />)}</div>;
  }

  const level = [...LEVELS].reverse().find((l) => xp >= l.at) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.at > xp);
  const pct = next ? ((xp - level.at) / (next.at - level.at)) * 100 : 100;

  const resolved = saves
    .map((s) => ({ ...s, ref: resolveRef(s.section, s.slug) }))
    .filter((s) => s.ref)
    .sort((a, b) => b.at - a.at);

  const bySection = SECTIONS.map((sec) => ({
    section: sec,
    items: resolved.filter((r) => r.section === sec.id),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-10">
      {/* progress */}
      <section className="overflow-hidden rounded-card border border-soil-800 bg-soil-900">
        <div className="relative p-6">
          <Pattern seed={`xp-${level.name}`} className="absolute inset-0 h-full w-full opacity-10" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sun-500">Your level</p>
              <p className="font-display text-4xl text-soil-100">{level.name}</p>
            </div>
            <p className="font-display text-4xl tabular-nums text-sun-500">{xp} <span className="text-base text-soil-500">XP</span></p>
          </div>
          <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-soil-800">
            <div className="h-full rounded-full bg-sun-500 transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <p className="relative mt-2 text-xs text-soil-500">
            {next ? `${next.at - xp} XP to ${next.name}` : "Top level — now go record something."}
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-soil-800 border-t border-soil-800">
          <Tile icon={<Bookmark className="h-4 w-4" />} n={resolved.length} label="Saved" />
          <Tile icon={<GraduationCap className="h-4 w-4" />} n={learned.length} label="Learned" />
          <Tile icon={<Upload className="h-4 w-4" />} n={posts.length} label="Contributed" />
        </div>
      </section>

      {/* your contributions */}
      {posts.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-soil-100">
            <Flame className="h-5 w-5 text-veld-400" /> What you added
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-card border border-soil-800 bg-soil-900">
                <Link href={`/feed?post=${p.id}`} className="block">
                  <div className="relative h-24 overflow-hidden">
                    <Pattern seed={p.id} className="h-full w-full" />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {p.mediaKind} · {p.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 font-semibold leading-snug text-soil-100">{p.caption}</p>
                    <p className="mt-1 text-xs text-soil-500">{p.place} · {new Date(p.createdAt).toLocaleDateString("en-ZA")}</p>
                  </div>
                </Link>
                <button
                  onClick={() => removePost(p.id)}
                  aria-label="Delete"
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white/70 opacity-0 backdrop-blur transition group-hover:opacity-100 hover:text-clay-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* saves */}
      {resolved.length === 0 ? (
        <section className="rounded-card border border-dashed border-soil-700 p-10 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-soil-600" />
          <h2 className="mt-4 font-display text-2xl text-soil-100">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-md leading-relaxed text-soil-400">
            Tap the bookmark on any game, word, story, poem, recipe, tradition or place and it
            collects here. Everything is kept on this device.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {SECTIONS.slice(0, 4).map((s) => (
              <Link key={s.id} href={s.href} className="rounded-full border border-soil-700 px-4 py-2 text-sm font-semibold text-soil-200 transition hover:border-soil-500">
                {s.emoji} {s.label}
              </Link>
            ))}
          </div>
        </section>
      ) : (
        bySection.map(({ section, items }) => (
          <section key={section.id}>
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-soil-100">
              <span>{section.emoji}</span> {section.label}
              <span className="text-base text-soil-600">{items.length}</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <div key={`${s.section}:${s.slug}`} className="group relative">
                  <Link
                    href={s.ref!.href}
                    className="flex gap-3 rounded-card border border-soil-800 bg-soil-900 p-3 transition hover:border-soil-600"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Pattern seed={s.slug} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 pr-6">
                      <p className="font-display text-lg leading-tight text-soil-100">{s.ref!.title}</p>
                      <p className="line-clamp-1 text-xs text-soil-500">{s.ref!.subtitle}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleSave(s.section, s.slug)}
                    aria-label="Remove"
                    className="absolute right-2 top-2 rounded-full p-1.5 text-soil-600 opacity-0 transition group-hover:opacity-100 hover:text-clay-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {/* learned */}
      {learned.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-soil-100">
            <Trophy className="h-5 w-5 text-sun-500" /> Marked as learned
          </h2>
          <div className="flex flex-wrap gap-2">
            {learned.map((id) => {
              const [section, slug] = id.split(":");
              const ref = resolveRef(section as never, slug);
              return ref ? (
                <Link key={id} href={ref.href}><Chip tone="sun">✓ {ref.title}</Chip></Link>
              ) : <Chip key={id}>✓ {slug}</Chip>;
            })}
          </div>
        </section>
      )}

      <DataControls />
    </div>
  );
}

function Tile({ icon, n, label }: { icon: React.ReactNode; n: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <span className="text-soil-500">{icon}</span>
      <span className="font-display text-2xl tabular-nums text-soil-100">{n}</span>
      <span className="text-[11px] font-bold uppercase tracking-widest text-soil-500">{label}</span>
    </div>
  );
}
