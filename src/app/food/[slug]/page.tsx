import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChefHat, Flame, Lightbulb, Mic, Users } from "lucide-react";
import { RECIPES, RECIPE_BY_SLUG, RECIPE_KINDS } from "@/content/food";
import { PROVINCE_LABEL } from "@/content";
import { Chip, SaveButton, LearnedTick, BeadRule, Stat } from "@/components/ui";
import { Pattern } from "@/components/Pattern";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = RECIPE_BY_SLUG[slug];
  if (!r) return { title: "Recipe not found" };
  return { title: r.name, description: r.story.slice(0, 155) };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = RECIPE_BY_SLUG[slug];
  if (!r) notFound();
  const kind = RECIPE_KINDS.find((k) => k.id === r.kind);
  const more = RECIPES.filter((x) => x.slug !== r.slug && (x.kind === r.kind || x.province === r.province)).slice(0, 3);

  return (
    <article className="pb-16">
      <header className="relative overflow-hidden border-b border-soil-800">
        <Pattern seed={r.slug} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/85 to-soil-950/40" />
        <div className="relative mx-auto w-full max-w-4xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
          <Link href="/food" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 transition hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> All recipes
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone="veld">{kind?.label}</Chip>
            <Chip>{r.region}</Chip>
            <Chip>{PROVINCE_LABEL[r.province]}</Chip>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none text-soil-100 sm:text-6xl">{r.name}</h1>
          {r.aka.length > 0 && (
            <p className="mt-2 text-sm text-soil-500">also called {r.aka.join(" · ")}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SaveButton section="food" slug={r.slug} label />
            <LearnedTick id={`food:${r.slug}`} xp={30} label="I cooked this" />
          </div>
        </div>
        <BeadRule />
      </header>

      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={<Flame className="h-4 w-4" />} label="Time" value={r.time} />
          <Stat icon={<Users className="h-4 w-4" />} label="Serves" value={r.serves} />
          <Stat icon={<ChefHat className="h-4 w-4" />} label="Heat" value={r.heat} />
        </div>

        <section className="mt-8">
          <h2 className="mb-3 font-display text-2xl text-soil-100">Where it comes from</h2>
          <p className="text-pretty text-lg leading-relaxed text-soil-300">{r.story}</p>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <section>
            <h2 className="mb-3 font-display text-2xl text-soil-100">What you need</h2>
            <div className="space-y-4 rounded-card border border-soil-800 bg-soil-900 p-5">
              {r.ingredients.map((g, i) => (
                <div key={i}>
                  {g.group && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-veld-400">{g.group}</p>}
                  <ul className="space-y-1.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-2.5 text-sm leading-snug text-soil-300">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-soil-600" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="mb-2 mt-6 font-display text-xl text-soil-100">Serve with</h3>
            <div className="flex flex-wrap gap-1.5">
              {r.serveWith.map((s) => <Chip key={s} tone="veld">{s}</Chip>)}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-2xl text-soil-100">How to make it</h2>
            <ol className="space-y-3">
              {r.method.map((m, i) => (
                <li key={i} className="flex gap-4 rounded-2xl border border-soil-800 bg-soil-900 p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-veld-500/15 font-display text-sm text-veld-400">{i + 1}</span>
                  <span className="leading-relaxed text-soil-300">{m}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex gap-3 rounded-card border border-sun-500/25 bg-sun-500/10 p-5">
              <Lightbulb className="h-5 w-5 shrink-0 text-sun-500" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sun-500">The bit that matters</p>
                <p className="mt-1.5 leading-relaxed text-soil-200">{r.tip}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {r.tags.map((t) => <Chip key={t}>#{t}</Chip>)}
        </div>

        <div className="mt-10 rounded-card border border-dashed border-soil-700 bg-soil-900/50 p-6">
          <Mic className="h-5 w-5 text-veld-400" />
          <h3 className="mt-3 font-display text-xl text-soil-100">Your family makes it differently</h3>
          <p className="mt-2 leading-relaxed text-soil-400">
            They always do. Record your mother or your gogo making it, in whatever language they cook in,
            and add the version your house uses.
          </p>
          <Link
            href={`/contribute?kind=food&about=${r.slug}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-veld-500 px-5 py-3 text-sm font-bold text-soil-950 transition hover:bg-veld-400"
          >
            <Mic className="h-4 w-4" /> Add your family&apos;s version
          </Link>
        </div>

        {more.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 font-display text-2xl text-soil-100">Cook this next</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {more.map((m) => (
                <Link key={m.slug} href={`/food/${m.slug}`} className="group overflow-hidden rounded-2xl border border-soil-800 bg-soil-900 transition hover:border-soil-600">
                  <div className="relative h-24 overflow-hidden">
                    <Pattern seed={m.slug} className="h-full w-full transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-3">
                    <p className="font-display text-lg leading-tight text-soil-100">{m.name}</p>
                    <p className="text-xs text-soil-500">{m.time}</p>
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
