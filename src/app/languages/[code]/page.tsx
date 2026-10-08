import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mic } from "lucide-react";
import { LANGUAGES, LANGUAGE_BY_CODE } from "@/content/languages";
import { PROVINCE_LABEL } from "@/content";
import { Chip, SaveButton, BeadRule } from "@/components/ui";
import { Pattern } from "@/components/Pattern";
import { LanguageStudio } from "@/components/sections/LanguageStudio";

export function generateStaticParams() {
  return LANGUAGES.map((l) => ({ code: l.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const l = LANGUAGE_BY_CODE[code];
  if (!l) return { title: "Language not found" };
  return { title: l.name, description: l.blurb };
}

export default async function LanguagePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const lang = LANGUAGE_BY_CODE[code];
  if (!lang) notFound();

  return (
    <article className="pb-16">
      <header className="relative overflow-hidden border-b border-soil-800">
        <Pattern seed={lang.code} className="absolute inset-0 h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/85 to-soil-950/40" />
        <div className="relative mx-auto w-full max-w-5xl px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-10">
          <Link href="/languages" className="inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 transition hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> All languages
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone="ink">{lang.family}</Chip>
            <Chip>{lang.share}% of homes</Chip>
            <Chip>{lang.regions.map((r) => PROVINCE_LABEL[r]).join(" · ")}</Chip>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-none text-soil-100 sm:text-7xl">{lang.name}</h1>
          {lang.endonym !== lang.name && <p className="mt-1 font-display text-xl text-soil-500">{lang.endonym}</p>}
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-soil-300">{lang.blurb}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <SaveButton section="languages" slug={lang.code} label />
            <Link
              href={`/contribute?kind=language&about=${lang.code}`}
              className="inline-flex items-center gap-2 rounded-full border border-soil-700 bg-soil-900/70 px-4 py-2.5 text-sm font-semibold text-soil-200 backdrop-blur transition hover:border-veld-500/60 hover:text-veld-400"
            >
              <Mic className="h-4 w-4" /> Record a word
            </Link>
          </div>
        </div>
        <BeadRule />
      </header>

      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <LanguageStudio lang={lang} />
      </div>
    </article>
  );
}
