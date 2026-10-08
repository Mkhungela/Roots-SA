import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Languages, MapPin, Mic, Quote } from "lucide-react";
import { STORIES, STORY_BY_SLUG, STORY_KINDS } from "@/content/stories";
import { PROVINCE_LABEL } from "@/content";
import { Chip, SaveButton, SeedBadge, BeadRule } from "@/components/ui";
import { Pattern } from "@/components/Pattern";
import { AudioPlayer } from "@/components/AudioPlayer";

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = STORY_BY_SLUG[slug];
  if (!s) return { title: "Story not found" };
  return { title: s.title, description: s.summary };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = STORY_BY_SLUG[slug];
  if (!story) notFound();
  const kind = STORY_KINDS.find((k) => k.id === story.kind);
  const others = STORIES.filter((s) => s.slug !== story.slug && (s.kind === story.kind || s.province === story.province)).slice(0, 3);

  return (
    <article className="pb-16">
      <header className="relative overflow-hidden border-b border-soil-800">
        <Pattern seed={story.slug} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/85 to-soil-950/40" />
        <div className="relative mx-auto w-full max-w-3xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
          <Link href="/stories" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 transition hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> All stories
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone="clay">{kind?.emoji} {kind?.label}</Chip>
            <Chip>{story.year}</Chip>
            <SeedBadge />
          </div>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-soil-100 sm:text-6xl">{story.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-soil-400">
            <span className="flex items-center gap-1.5 font-semibold text-soil-200">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-soil-800 text-xs">{kind?.emoji}</span>
              {story.teller}
            </span>
            <span>{story.tellerRole}</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{story.place}, {PROVINCE_LABEL[story.province]}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{story.minutes} min</span>
            <span className="flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" />{story.language}</span>
          </div>

          <div className="mt-6"><SaveButton section="stories" slug={story.slug} label /></div>
        </div>
        <BeadRule />
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        {story.audio && (
          <div className="mb-8">
            <AudioPlayer
              src={story.audio}
              title={`${story.teller} — ${story.title}`}
              subtitle={`${story.place}, ${PROVINCE_LABEL[story.province]} · ${story.language}`}
              accent="#e04524"
              synthetic
            />
          </div>
        )}

        <p className="text-pretty text-xl leading-relaxed text-soil-200">{story.summary}</p>

        <div className="my-8 border-l-2 border-clay-500 pl-5">
          <Quote className="mb-2 h-5 w-5 text-clay-500" />
          <p className="font-display text-2xl leading-snug text-soil-100 sm:text-3xl">{story.pullQuote}</p>
        </div>

        <div className="space-y-5">
          {story.body.map((p, i) => (
            <p key={i} className="text-pretty text-lg leading-relaxed text-soil-300">{p}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {story.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
        </div>

        <div className="mt-10 rounded-card border border-dashed border-soil-700 bg-soil-900/50 p-6">
          <Mic className="h-5 w-5 text-veld-400" />
          <h3 className="mt-3 font-display text-xl text-soil-100">Does your family have a version of this?</h3>
          <p className="mt-2 leading-relaxed text-soil-400">
            Record it. Thirty seconds on a phone is a contribution — the archive is built out of
            exactly this, one memory at a time.
          </p>
          <Link
            href={`/contribute?kind=story&about=${story.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-veld-500 px-5 py-3 text-sm font-bold text-soil-950 transition hover:bg-veld-400"
          >
            <Mic className="h-4 w-4" /> Record your version
          </Link>
        </div>

        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-2xl text-soil-100">Keep listening</h2>
            <div className="space-y-3">
              {others.map((s) => (
                <Link key={s.slug} href={`/stories/${s.slug}`} className="flex gap-4 rounded-2xl border border-soil-800 bg-soil-900 p-4 transition hover:border-soil-600">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Pattern seed={s.slug} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight text-soil-100">{s.title}</p>
                    <p className="mt-0.5 text-sm text-soil-500">{s.teller} · {s.place} · {s.minutes} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
