import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mic, Play, Quote, Sparkles } from "lucide-react";
import { ARCHIVE_SIZE, POSTS, PROVINCE_LABEL, SECTIONS, todayPicks } from "@/content";
import { ArtCard, BeadRule, Chip, SeedBadge } from "@/components/ui";
import { Pattern } from "@/components/Pattern";
import { TodayStrip } from "@/components/TodayStrip";

export const metadata: Metadata = {
  title: "ROOTS SA — a living archive of South African culture",
  description:
    "Indigenous games you can play, twelve languages, gogo stories, izibongo, recipes, ceremonies and a heritage map of South Africa — built so young people will actually use it, and so anyone can add to it.",
};


export default function HomePage() {
  const t = todayPicks();

  return (
    <div>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="grain relative overflow-hidden border-b border-soil-800">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-clay-500/25 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 top-20 h-[26rem] w-[26rem] rounded-full bg-ink-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sun-500/15 blur-[90px]" />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-20 sm:pt-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-soil-700 bg-soil-900/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-soil-300 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-sun-500" />
            Culture · Heritage · Learning
          </div>

          <h1 className="mt-5 max-w-4xl font-display text-[2.6rem] leading-[0.95] tracking-tight text-soil-100 sm:text-7xl lg:text-[5.2rem]">
            Our culture is not
            <br />
            in a museum.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-sun-500">It&apos;s in your gogo&apos;s voice.</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-clay-500/35 sm:bottom-2 sm:h-5" />
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-soil-300 sm:text-xl">
            ROOTS SA is a living archive of South African culture — indigenous games you can
            actually play, twelve languages, gogo stories, izibongo, recipes, ceremony and a
            heritage map. Built so young people will use it, and so elders can fill it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contribute"
              className="group inline-flex items-center gap-2 rounded-full bg-clay-500 px-6 py-3.5 text-sm font-bold text-soil-100 transition hover:bg-clay-400 active:scale-[0.98]"
            >
              <Mic className="h-4 w-4" />
              Record something
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/feed"
              className="inline-flex items-center gap-2 rounded-full border border-soil-700 bg-soil-900/70 px-6 py-3.5 text-sm font-bold text-soil-200 backdrop-blur transition hover:border-soil-500 hover:text-soil-100"
            >
              <Play className="h-4 w-4" />
              Watch the feed
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            {[
              { v: ARCHIVE_SIZE, l: "archive entries" },
              { v: 12, l: "official languages" },
              { v: 10, l: "indigenous games" },
              { v: 2, l: "playable right now" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-3xl text-soil-100 sm:text-4xl">{s.v}</dt>
                <dd className="text-xs uppercase tracking-widest text-soil-500">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <BeadRule />
      </section>

      {/* ---------------------------- today ------------------------------ */}
      <TodayStrip picks={t} />

      {/* --------------------------- sections ---------------------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-soil-100 sm:text-4xl">Everything in here</h2>
            <p className="mt-1.5 text-sm text-soil-400">Eight ways in. Start wherever you like.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="group relative flex min-h-[158px] flex-col justify-between overflow-hidden rounded-card border border-soil-800 bg-soil-900 p-4 transition hover:-translate-y-1 hover:border-soil-600 sm:min-h-[188px] sm:p-5"
            >
              {/* Texture only, and only in the corner — the label must always win. */}
              <Pattern
                seed={s.id}
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-[7px] opacity-[0.22] transition duration-500 group-hover:opacity-35 group-hover:scale-110"
              />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)` }}
              />
              <div className="relative">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl ring-1 transition group-hover:scale-105 sm:h-11 sm:w-11 sm:text-2xl"
                  style={{ background: `${s.accent}1f`, boxShadow: `inset 0 0 0 1px ${s.accent}38` }}
                >
                  {s.emoji}
                </span>
                <h3 className="mt-3 font-display text-lg leading-tight text-soil-50 sm:text-xl">{s.label}</h3>
                <p className="mt-1 text-xs leading-snug text-soil-300 sm:text-[13px]">{s.blurb}</p>
              </div>
              <div className="relative mt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: s.accent }}>
                  {s.count} entries
                </span>
                <ArrowRight className="h-4 w-4 text-soil-500 transition group-hover:translate-x-1 group-hover:text-soil-200" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------- contribute pitch ---------------------- */}
      <section className="relative overflow-hidden border-y border-soil-800 bg-soil-900/40">
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-veld-500/15 blur-[90px]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <Chip tone="veld">The point of all this</Chip>
            <h2 className="mt-4 max-w-xl font-display text-3xl leading-[1.05] text-soil-100 sm:text-5xl">
              Anyone can add to the archive.
            </h2>
            <p className="mt-5 max-w-xl text-pretty leading-relaxed text-soil-300">
              Oral history exists precisely to preserve memories, songs, poems and community
              experience that were never written down. The problem researchers keep running
              into is access: rural oral-history collections sit in formats and places that
              young people never reach.
            </p>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-soil-300">
              So this is built the other way around — a phone, a record button, and a feed
              that young people already know how to use. The elder is the author, not the
              subject.
            </p>
            <Link
              href="/contribute"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-sun-500 px-6 py-3.5 text-sm font-bold text-soil-950 transition hover:bg-sun-400 active:scale-[0.98]"
            >
              <Mic className="h-4 w-4" /> Start recording
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { who: "A grandmother in Limpopo", what: "“When I was young, this is how we played…”", tone: "sun" as const },
              { who: "A teenager in the village", what: "“This is how we play diketo where I am from.”", tone: "veld" as const },
              { who: "Someone from Soweto", what: "“This is how weddings were done in my family.”", tone: "clay" as const },
              { who: "A father in Gqeberha", what: "“This is my mother's recipe. She never wrote it down.”", tone: "ink" as const },
            ].map((c) => (
              <div key={c.who} className="flex gap-3 rounded-2xl border border-soil-800 bg-soil-900 p-4">
                <Quote className="h-5 w-5 shrink-0 text-soil-600" />
                <div>
                  <p className="font-display text-base leading-snug text-soil-100 sm:text-lg">{c.what}</p>
                  <Chip tone={c.tone} className="mt-2">{c.who}</Chip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------- feed ------------------------------ */}
      <section className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-soil-100 sm:text-4xl">From the feed</h2>
            <p className="mt-1.5 text-sm text-soil-400">What people are putting into the archive.</p>
          </div>
          <Link href="/feed" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sun-500 hover:text-sun-400">
            Open feed <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {POSTS.slice(0, 4).map((p) => (
            <ArtCard
              key={p.id}
              href={`/feed?post=${p.id}`}
              seed={p.id}
              tall
              eyebrow={<><Chip tone="clay">{p.mediaKind === "audio" ? "Audio" : p.mediaKind === "photo" ? "Photo" : p.duration}</Chip><SeedBadge /></>}
              title={p.caption}
              subtitle={`${p.name} · ${p.place}, ${PROVINCE_LABEL[p.province]}`}
              footer={<span className="text-soil-500">{(p.likes / 1000).toFixed(1)}k likes · {p.comments.length} comments</span>}
            />
          ))}
        </div>
      </section>

      <footer className="border-t border-soil-800 bg-soil-950">
        <BeadRule />
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-sm">
              <div className="font-display text-xl font-extrabold text-soil-100">ROOTS <span className="text-sun-500">SA</span></div>
              <p className="mt-2 text-sm leading-relaxed text-soil-400">
                A living cultural archive, not a static website. Built for Mzansi.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
              {SECTIONS.map((s) => (
                <Link key={s.id} href={s.href} className="text-soil-400 transition hover:text-soil-100">{s.label}</Link>
              ))}
              <Link href="/about" className="text-soil-400 transition hover:text-soil-100">About</Link>
              <Link href="/saved" className="text-soil-400 transition hover:text-soil-100">Saved</Link>
              <Link href="/contribute" className="text-soil-400 transition hover:text-soil-100">Contribute</Link>
            </nav>
          </div>
          <p className="mt-10 text-xs leading-relaxed text-soil-600">
            Entries marked <span className="text-soil-400">Sample</span> are illustrative seed content written to show the
            shape of the archive — they are not real recorded testimony. Historical information,
            dates and places are researched. Community recordings replace the samples as people contribute.
          </p>
        </div>
      </footer>
    </div>
  );
}
