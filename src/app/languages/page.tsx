import type { Metadata } from "next";
import Link from "next/link";
import { LANGUAGES } from "@/content/languages";
import { PROVINCE_LABEL } from "@/content";
import { PageHeader, Section, Chip } from "@/components/ui";
import { Pattern, seedColors } from "@/components/Pattern";

export const metadata: Metadata = {
  title: "Languages",
  description:
    "All twelve official South African languages — words, phrases, proverbs, idioms, slang and pronunciation, with flashcards and a click trainer.",
};

export default function LanguagesPage() {
  const total = LANGUAGES.reduce((n, l) => n + l.words.length + l.phrases.length + l.proverbs.length + l.idioms.length + l.slang.length, 0);
  return (
    <div>
      <PageHeader
        emoji="🗣️"
        kicker="Languages"
        accent="#2fc4d6"
        title="Twelve official languages. Most South Africans speak at least three."
        lead={`Words, phrases, proverbs, idioms and the slang nobody teaches you — ${total} entries with flashcards, a click trainer and a speaker button on everything.`}
      />
      <Section>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LANGUAGES.map((l) => {
            const [c1] = seedColors(l.code);
            const entries = l.words.length + l.phrases.length + l.proverbs.length + l.idioms.length + l.slang.length;
            return (
              <Link
                key={l.code}
                href={`/languages/${l.code}`}
                className="group relative overflow-hidden rounded-card border border-soil-800 bg-soil-900 p-5 transition hover:-translate-y-1 hover:border-soil-600"
              >
                <Pattern seed={l.code} className="absolute inset-0 h-full w-full opacity-[0.12] transition duration-500 group-hover:opacity-20 group-hover:scale-105" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl leading-tight text-soil-100">{l.name}</h3>
                      {l.endonym !== l.name && <p className="text-sm text-soil-500">{l.endonym}</p>}
                    </div>
                    <span className="shrink-0 font-display text-2xl tabular-nums" style={{ color: c1 }}>
                      {l.share}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-wider text-soil-500">{l.speakersNote}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-soil-800">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(l.share * 3.6, 2)}%`, background: c1 }} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    <Chip>{entries} entries</Chip>
                    <Chip>{l.regions.map((r) => PROVINCE_LABEL[r]).slice(0, 2).join(" · ")}</Chip>
                  </div>
                  <p className="mt-3 font-display text-lg text-soil-200">{l.greetings[0]?.term}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-soil-600">
          Home-language shares are from Census 2022 (Statistics South Africa) and are rounded.
          South African Sign Language became the twelfth official language in July 2023.
        </p>
      </Section>
    </div>
  );
}
