import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BookOpen, Cloud, Database, KeyRound, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { ARCHIVE_SIZE, SECTIONS } from "@/content";
import { PageHeader, Section, BeadRule, Chip } from "@/components/ui";
import { Pattern } from "@/components/Pattern";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why ROOTS SA exists, what is in it, what is real and what is illustrative, and how the archive is built and stored.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        emoji="🌍"
        kicker="About"
        accent="#f5a623"
        title="Most of South Africa's history was never written down. It was said out loud."
        lead="And the people who can still say it are old. ROOTS SA is an attempt to catch it in the form it actually exists in — a voice, in a kitchen, in a language that is not English."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-soil-300">
            <p>
              An oral archive has one problem: it lives in people. When a gogo in Ga-Masemola dies,
              the version of a song she carried dies with her unless somebody pressed record.
              There <em className="not-italic text-soil-100">are</em> real oral history archives in South Africa — in
              universities, in museums, in provincial collections. They are good. They are also
              catalogued in English, locked behind institutional access, and built for researchers.
            </p>
            <p>
              A sixteen-year-old in Soweto is never going to open a finding aid. They will open
              something that looks like the apps they already use. So this is built like one:
              vertical video, a save button, a streak, a game you can actually play — with the
              archive underneath it.
            </p>
            <p className="font-display text-2xl leading-snug text-soil-100">
              The point is not that young people should respect heritage. The point is that heritage
              should be where young people already are.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-card border border-soil-800 bg-soil-900 p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-sun-500">In the archive right now</p>
              <p className="mt-2 font-display text-5xl text-soil-100">{ARCHIVE_SIZE}</p>
              <p className="text-sm text-soil-500">entries across eight sections</p>
              <ul className="mt-4 space-y-1.5">
                {SECTIONS.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={s.href} className="text-soil-300 transition hover:text-soil-100">{s.emoji} {s.label}</Link>
                    <span className="tabular-nums text-soil-600">{s.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <BeadRule />

      <Section title="What is real and what is illustrative" kicker="Be honest about it">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            icon={<BookOpen className="h-5 w-5 text-veld-400" />}
            title="Real and researched"
            tone="veld"
          >
            <p>
              The historical content is real: the heritage places and what happened at them,
              the languages and their Census 2022 home-language shares, the rules and origins
              of the games, the meaning of garments and ceremonies, the recipes, and the
              background on the poetry traditions.
            </p>
            <p className="mt-3">
              Where a practice is contested — deaths at illegal initiation schools, lobola and
              commodification, the consent debate around the Reed Dance, gentrification in
              Bo-Kaap, the two separate museums at Ncome and Blood River — the disagreement is
              written in rather than smoothed over.
            </p>
          </Card>

          <Card
            icon={<AlertTriangle className="h-5 w-5 text-sun-500" />}
            title="Illustrative, and labelled as such"
            tone="sun"
          >
            <p>
              The individual personal testimonies — the gogo stories, the community voices on
              map pins, the feed posts and the sample poems — are written examples, not recorded
              oral history from named real people. Every one of them carries a{" "}
              <Chip tone="sun">Sample archive entry</Chip> chip.
            </p>
            <p className="mt-3">
              They exist to show the shape of the thing. They are meant to be replaced, one by one,
              by actual recordings from actual people. That replacement is the whole project.
            </p>
          </Card>

          <Card icon={<ShieldCheck className="h-5 w-5 text-ink-400" />} title="What is deliberately not here" tone="ink">
            <p>
              Initiation content beyond what is already public, clan secrets, and anything restricted
              to a ceremony are not in the archive and are not accepted as contributions. The
              contribution form asks you to confirm this before you publish.
            </p>
            <p className="mt-3">
              Living poets&apos; work is written <em className="not-italic text-soil-100">about</em>, never reproduced.
              Traditional izibongo appear only as short, widely published excerpts.
            </p>
          </Card>

          <Card icon={<Mic className="h-5 w-5 text-clay-400" />} title="How to actually help" tone="clay">
            <p>
              Record someone. Ask one question and then be quiet for ninety seconds. Ask your gogo
              what the walk to school was like, or your uncle what the word means that nobody outside
              your family uses.
            </p>
            <Link
              href="/contribute"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-clay-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-clay-400"
            >
              <Mic className="h-4 w-4" /> Add something
            </Link>
          </Card>
        </div>
      </Section>

      <Section title="Accounts, and what is stored about you" kicker="No dark patterns">
        <div className="grid gap-4 md:grid-cols-2">
          <Card icon={<KeyRound className="h-5 w-5 text-sky-cyan" />} title="Reading never needs an account" tone="ink">
            <p>
              You can read, listen, play Morabaraba, save entries and earn XP without ever telling
              us who you are, and that will not change. Signing in matters only when you
              <em className="not-italic text-soil-100"> contribute</em> — because a recording with
              no owner cannot be credited to the person who gave it, and cannot be taken down
              later if their family changes their mind.
            </p>
            <p className="mt-3">
              When an archive server is connected, sign-in is a one-time emailed link. No password.
            </p>
          </Card>
          <Card icon={<Database className="h-5 w-5 text-sun-500" />} title="Where your things actually live" tone="sun">
            <p>
              Saves, likes, learned ticks and XP go into this browser&apos;s local storage.
              Recordings go into IndexedDB in this browser — not into local storage, because a
              recording is far too big for it and a blob link would die on the next page load.
            </p>
            <p className="mt-3">
              <Link href="/saved" className="font-semibold text-sun-500 underline">Your archive</Link>{" "}
              shows exactly how much is stored and lets you delete any category, or all of it, for real.
            </p>
          </Card>
        </div>
      </Section>

      <Section title="How it is built" kicker="For the curious">
        <div className="grid gap-4 md:grid-cols-3">
          <Tech icon={<Sparkles className="h-5 w-5" />} title="Next.js, React, Tailwind">
            App Router with server components for the archive and client components for everything
            interactive — the map, the feed, the Morabaraba engine, the recorder. No analytics,
            no trackers.
          </Tech>
          <Tech icon={<Database className="h-5 w-5" />} title="Supabase, when you connect it">
            Postgres with row-level security, email auth and a media bucket. The schema lives in{" "}
            <code className="rounded bg-soil-800 px-1.5 py-0.5 text-xs text-soil-200">supabase/migrations</code>.
            Set the two public env vars and the app switches from this device to the shared archive.
          </Tech>
          <Tech icon={<Cloud className="h-5 w-5" />} title="Offline by default">
            The map is hand-built SVG from public-domain province geometry, not a tile server. The
            cover art is generated from each entry&apos;s slug. Nothing on a page needs a third party
            to be up.
          </Tech>
        </div>
      </Section>

      <section className="relative mx-auto mt-6 w-full max-w-6xl overflow-hidden rounded-card border border-soil-800 px-5 py-14 text-center sm:px-8">
        <Pattern seed="about-foot" className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/80 to-soil-950/50" />
        <div className="relative">
          <p className="font-display text-3xl leading-snug text-soil-100 sm:text-4xl">
            Indlela ibuzwa kwabaphambili.
          </p>
          <p className="mt-2 text-soil-400">The way is asked from those who have gone ahead.</p>
          <Link
            href="/contribute"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun-500 px-6 py-3.5 font-bold text-soil-950 transition hover:bg-sun-400"
          >
            <Mic className="h-5 w-5" /> So go and ask them
          </Link>
        </div>
      </section>
      <div className="h-16" />
    </div>
  );
}

function Card({ icon, title, tone, children }: { icon: React.ReactNode; title: string; tone: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-soil-800 bg-soil-900 p-6">
      <div className="flex items-center gap-2.5">
        {icon}
        <h3 className="font-display text-xl text-soil-100">{title}</h3>
      </div>
      <div className="mt-3 leading-relaxed text-soil-300">{children}</div>
    </div>
  );
}

function Tech({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-soil-800 bg-soil-900 p-5">
      <span className="text-soil-500">{icon}</span>
      <h3 className="mt-3 font-display text-lg text-soil-100">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-soil-400">{children}</p>
    </div>
  );
}
