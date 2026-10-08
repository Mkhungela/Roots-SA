import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mic, Sparkles, Trophy } from "lucide-react";
import { POEMS, POEM_BY_SLUG, POEM_KINDS } from "@/content/poetry";
import { Chip, SaveButton, BeadRule } from "@/components/ui";
import { Pattern } from "@/components/Pattern";
import { AudioPlayer } from "@/components/AudioPlayer";

export function generateStaticParams() {
  return POEMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POEM_BY_SLUG[slug];
  if (!p) return { title: "Not found" };
  return { title: p.title, description: p.about };
}

export default async function PoemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poem = POEM_BY_SLUG[slug];
  if (!poem) notFound();
  const isChallenge = poem.kind === "challenge";

  return (
    <article className="pb-16">
      <header className="relative overflow-hidden border-b border-soil-800">
        <Pattern seed={poem.slug} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/85 to-soil-950/40" />
        <div className="relative mx-auto w-full max-w-3xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
          <Link href="/poetry" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 transition hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> All poetry
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone={isChallenge ? "sun" : "bead"}>{POEM_KINDS.find((k) => k.id === poem.kind)?.label}</Chip>
            <Chip>{poem.language}</Chip>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-soil-100 sm:text-6xl">{poem.title}</h1>
          <p className="mt-3 text-sm text-soil-400">
            <span className="font-semibold text-soil-200">{poem.poet}</span> · {poem.poetRole}
          </p>
          <div className="mt-6"><SaveButton section="poetry" slug={poem.slug} label /></div>
        </div>
        <BeadRule />
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        {poem.audio && (
          <div className="mb-8">
            <AudioPlayer src={poem.audio} title={poem.title} subtitle={poem.poet} accent="#ec3b80" synthetic />
          </div>
        )}

        <p className="text-pretty text-xl leading-relaxed text-soil-200">{poem.about}</p>

        {poem.lines && poem.lines.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-card border border-soil-800 bg-soil-900">
            <div className="border-b border-soil-800 px-5 py-3 text-xs font-bold uppercase tracking-widest text-soil-500">
              {poem.kind === "izibongo" ? "The opening lines" : "Examples"}
            </div>
            <ul className="divide-y divide-soil-800">
              {poem.lines.map((l, i) => (
                <li key={i} className="px-5 py-4">
                  <p className="font-display text-xl leading-snug text-soil-100 sm:text-2xl">{l.text}</p>
                  {l.translation && <p className="mt-1.5 text-sm italic text-soil-400">{l.translation}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {isChallenge && poem.prompt && (
          <section className="mt-8">
            <div className="relative overflow-hidden rounded-card border border-sun-500/30 bg-sun-500/10 p-6">
              <Trophy className="absolute -right-4 -top-4 h-28 w-28 text-sun-500/10" />
              <div className="relative">
                <div className="text-xs font-bold uppercase tracking-widest text-sun-500">The brief</div>
                <p className="mt-3 text-pretty text-lg leading-relaxed text-soil-100">{poem.prompt}</p>
                <Link
                  href={`/contribute?kind=poetry&challenge=${poem.slug}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-sun-500 px-5 py-3 text-sm font-bold text-soil-950 transition hover:bg-sun-400"
                >
                  <Mic className="h-4 w-4" /> Record your entry
                </Link>
                <p className="mt-3 text-xs text-soil-500">
                  {poem.entries === 0 ? "No entries yet. Be the first." : `${poem.entries} entries`} · {poem.closes}
                </p>
              </div>
            </div>
          </section>
        )}

        {poem.notes && poem.notes.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-soil-100">
              <Sparkles className="h-5 w-5 text-bead-400" />
              {isChallenge ? "How to do it well" : "What to listen for"}
            </h2>
            <ul className="space-y-3">
              {poem.notes.map((n, i) => (
                <li key={i} className="flex gap-3 rounded-2xl border border-soil-800 bg-soil-900 p-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-bead-500" />
                  <span className="leading-relaxed text-soil-300">{n}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {poem.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
        </div>
      </div>
    </article>
  );
}
