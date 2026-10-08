import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mic } from "lucide-react";
import { CULTURE, CULTURE_BY_SLUG, CULTURE_KINDS } from "@/content/culture";
import { PROVINCE_LABEL } from "@/content";
import { POSTS } from "@/content/feed";
import { Chip, SaveButton, LearnedTick, BeadRule } from "@/components/ui";
import { Pattern } from "@/components/Pattern";

export function generateStaticParams() {
  return CULTURE.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = CULTURE_BY_SLUG[slug];
  if (!c) return { title: "Not found" };
  return { title: c.name, description: c.oneLine };
}

export default async function CulturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = CULTURE_BY_SLUG[slug];
  if (!item) notFound();
  const kind = CULTURE_KINDS.find((k) => k.id === item.kind);
  const siblings = CULTURE.filter((c) => c.slug !== item.slug && c.kind === item.kind).slice(0, 4);
  const posts = POSTS.filter((p) => p.link?.section === "culture" && p.link?.slug === item.slug);

  return (
    <article className="pb-16">
      <header className="relative overflow-hidden border-b border-soil-800">
        <Pattern seed={item.slug} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/85 to-soil-950/40" />
        <div className="relative mx-auto w-full max-w-3xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
          <Link href="/culture" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 transition hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> All of culture
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone="ink">{kind?.emoji} {kind?.label}</Chip>
            <Chip>{item.people}</Chip>
            <Chip>{PROVINCE_LABEL[item.province]}</Chip>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none text-soil-100 sm:text-6xl">{item.name}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-soil-300">{item.oneLine}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SaveButton section="culture" slug={item.slug} label />
            <LearnedTick id={`culture:${item.slug}`} xp={25} />
          </div>
        </div>
        <BeadRule />
      </header>

      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        <dl className="grid gap-2 sm:grid-cols-2">
          {item.facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-soil-800 bg-soil-900 p-4">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-soil-500">{f.label}</dt>
              <dd className="mt-1 leading-snug text-soil-200">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 space-y-5">
          {item.body.map((p, i) => (
            <p key={i} className="text-pretty text-lg leading-relaxed text-soil-300">{p}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {item.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
        </div>

        {posts.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-display text-2xl text-soil-100">From the feed</h2>
            <div className="space-y-2">
              {posts.map((p) => (
                <Link key={p.id} href={`/feed?post=${p.id}`} className="flex items-center gap-3 rounded-2xl border border-soil-800 bg-soil-900 p-4 transition hover:border-soil-600">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"><Pattern seed={p.id} className="h-full w-full" /></div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-soil-100">{p.caption}</p>
                    <p className="text-xs text-soil-500">{p.handle} · {p.place}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 rounded-card border border-dashed border-soil-700 bg-soil-900/50 p-6">
          <Mic className="h-5 w-5 text-ink-400" />
          <h3 className="mt-3 font-display text-xl text-soil-100">Tell us how it is done where you are</h3>
          <p className="mt-2 leading-relaxed text-soil-400">
            Practice differs by family, by clan and by village. If this is yours, correct it, extend it,
            or record someone who knows it better.
          </p>
          <Link
            href={`/contribute?kind=culture&about=${item.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-ink-400"
          >
            <Mic className="h-4 w-4" /> Add to this
          </Link>
        </div>

        {siblings.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-2xl text-soil-100">More {kind?.label.toLowerCase()}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {siblings.map((s) => (
                <Link key={s.slug} href={`/culture/${s.slug}`} className="group flex gap-3 rounded-2xl border border-soil-800 bg-soil-900 p-3 transition hover:border-soil-600">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"><Pattern seed={s.slug} className="h-full w-full" /></div>
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight text-soil-100">{s.name}</p>
                    <p className="line-clamp-2 text-xs leading-snug text-soil-500">{s.oneLine}</p>
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
