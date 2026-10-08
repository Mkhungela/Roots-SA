import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gamepad2, MapPin, Package, Target, Trophy, Users } from "lucide-react";
import { GAMES, GAME_BY_SLUG } from "@/content/games";
import { POSTS, PROVINCE_LABEL } from "@/content";
import { Chip, SaveButton, LearnedTick, BeadRule, SeedBadge } from "@/components/ui";
import { Pattern } from "@/components/Pattern";
import { Morabaraba } from "@/components/games/Morabaraba";
import { Diketo } from "@/components/games/Diketo";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = GAME_BY_SLUG[slug];
  if (!g) return { title: "Game not found" };
  return { title: g.name, description: g.tagline };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = GAME_BY_SLUG[slug];
  if (!game) notFound();

  const related = POSTS.filter((p) => p.link?.section === "games" && p.link.slug === game.slug);

  return (
    <article className="pb-16">
      {/* -------------------------------- hero -------------------------------- */}
      <header className="relative overflow-hidden border-b border-soil-800">
        <Pattern seed={game.slug} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/80 to-soil-950/40" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-10">
          <Link href="/games" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 transition hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> All games
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {game.playable && <Chip tone="veld"><Gamepad2 className="h-3 w-3" /> Playable in the browser</Chip>}
            {game.tags.map((t) => <Chip key={t}>{t}</Chip>)}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none text-soil-100 sm:text-7xl">{game.name}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-soil-300">{game.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {game.aka.map((a) => (
              <span key={a.name} className="rounded-xl border border-soil-700 bg-soil-900/70 px-3 py-2 text-sm backdrop-blur">
                <span className="font-semibold text-soil-100">{a.name}</span>
                <span className="ml-2 text-xs text-soil-500">{a.lang}</span>
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <SaveButton section="games" slug={game.slug} label />
            <LearnedTick id={`game:${game.slug}`} xp={40} label="I know how to play this" />
          </div>
        </div>
      </header>

      {/* ------------------------------ play now ------------------------------ */}
      {game.playable && (
        <section className="border-b border-soil-800 bg-soil-900/30">
          <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
            <div className="mb-4 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-veld-400" />
              <h2 className="font-display text-2xl text-soil-100">Play it now</h2>
            </div>
            {game.playable === "morabaraba" ? <Morabaraba /> : <Diketo />}
          </div>
        </section>
      )}

      <div className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        {/* ------------------------------- facts ------------------------------ */}
        <div className="grid gap-3 py-8 sm:grid-cols-3">
          <Fact icon={<Users className="h-4 w-4" />} label="Players" value={game.players} />
          <Fact icon={<Target className="h-4 w-4" />} label="Ages" value={game.ages} />
          <Fact icon={<MapPin className="h-4 w-4" />} label="Played in" value={game.provinces.map((p) => PROVINCE_LABEL[p]).join(", ")} />
        </div>

        {/* ------------------------------- about ------------------------------ */}
        <section className="pb-8">
          <p className="text-pretty text-lg leading-relaxed text-soil-200">{game.about}</p>
        </section>

        <BeadRule className="my-2 rounded-full opacity-60" />

        {/* -------------------------------- kit ------------------------------- */}
        <section className="py-8">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl text-soil-100">
            <Package className="h-5 w-5 text-sun-500" /> What you need
          </h2>
          <ul className="flex flex-wrap gap-2">
            {game.kit.map((k) => (
              <li key={k} className="rounded-xl border border-soil-800 bg-soil-900 px-4 py-2.5 text-sm text-soil-200">{k}</li>
            ))}
          </ul>
        </section>

        {/* ------------------------------- how to ----------------------------- */}
        <section className="py-8">
          <h2 className="mb-5 font-display text-2xl text-soil-100 sm:text-3xl">How to play</h2>
          <ol className="space-y-3">
            {game.how.map((step, i) => (
              <li key={i} className="flex gap-4 rounded-2xl border border-soil-800 bg-soil-900 p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun-500 font-display text-sm font-bold text-soil-950">{i + 1}</span>
                <p className="pt-1 leading-relaxed text-soil-200">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------- rules ----------------------------- */}
        <section className="py-8">
          <h2 className="mb-5 font-display text-2xl text-soil-100 sm:text-3xl">The rules people argue about</h2>
          <ul className="space-y-2.5">
            {game.rules.map((r) => (
              <li key={r} className="flex gap-3 text-soil-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------- variations --------------------------- */}
        <section className="py-8">
          <h2 className="mb-2 font-display text-2xl text-soil-100 sm:text-3xl">Regional variations</h2>
          <p className="mb-5 text-sm text-soil-400">
            Every neighbourhood plays it differently. If yours is not here, that is a gap you can fill.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {game.variations.map((v) => (
              <div key={v.place} className="rounded-2xl border border-soil-800 bg-soil-900 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sun-500">
                  <MapPin className="h-3.5 w-3.5" /> {v.place}
                </div>
                <p className="mt-2 leading-relaxed text-soil-300">{v.text}</p>
              </div>
            ))}
            <Link
              href={`/contribute?kind=game&about=${game.slug}`}
              className="flex min-h-[110px] flex-col items-start justify-center rounded-2xl border border-dashed border-soil-700 bg-soil-900/40 p-4 transition hover:border-veld-500/60 hover:bg-soil-900"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-veld-400">Add yours</span>
              <p className="mt-2 leading-relaxed text-soil-300">
                How is {game.name} played where you are from? Record it.
              </p>
            </Link>
          </div>
        </section>

        {/* ----------------------------- challenge ---------------------------- */}
        <section className="py-8">
          <div className="relative overflow-hidden rounded-card border border-sun-500/30 bg-sun-500/10 p-6">
            <Trophy className="absolute -right-4 -top-4 h-28 w-28 text-sun-500/10" />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest text-sun-500">Challenge · +{game.challenge.xp} XP</div>
              <h3 className="mt-2 font-display text-2xl text-soil-100">{game.challenge.title}</h3>
              <p className="mt-2 max-w-xl leading-relaxed text-soil-300">{game.challenge.brief}</p>
              <Link
                href={`/contribute?kind=game&about=${game.slug}&challenge=${game.slug}`}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-sun-500 px-5 py-3 text-sm font-bold text-soil-950 transition hover:bg-sun-400"
              >
                Enter the challenge
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------ demo tip ---------------------------- */}
        <section className="pb-8">
          <div className="rounded-2xl border border-soil-800 bg-soil-900 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-soil-500">Watch for this</div>
            <p className="mt-2 text-lg leading-relaxed text-soil-200">{game.demo}</p>
          </div>
        </section>

        {/* -------------------------- related posts --------------------------- */}
        {related.length > 0 && (
          <section className="pb-8">
            <h2 className="mb-4 font-display text-2xl text-soil-100">From the community</h2>
            <div className="space-y-3">
              {related.map((p) => (
                <Link key={p.id} href={`/feed?post=${p.id}`} className="flex gap-4 rounded-2xl border border-soil-800 bg-soil-900 p-4 transition hover:border-soil-600">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Pattern seed={p.id} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-soil-100">{p.name}</span>
                      <span className="text-xs text-soil-500">{p.place}</span>
                      <SeedBadge />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-soil-300">{p.caption}</p>
                    <span className="mt-1.5 block text-xs text-soil-600">{p.duration} · {(p.likes / 1000).toFixed(1)}k likes</span>
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

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-soil-800 bg-soil-900 p-4">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-soil-500">{icon}{label}</div>
      <div className="mt-1.5 font-semibold text-soil-100">{value}</div>
    </div>
  );
}
