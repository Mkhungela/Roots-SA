"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info, RotateCw, Shuffle, Volume2 } from "lucide-react";
import type { Entry, Language, Proverb } from "@/lib/types";
import { hasNativeVoice, hasSpeech, speak, warmVoices } from "@/lib/speak";
import { clsx, Chip } from "@/components/ui";
import { useStore } from "@/lib/store";

type Tab = "words" | "phrases" | "proverbs" | "idioms" | "slang" | "sound";

const TABS: { id: Tab; label: string }[] = [
  { id: "words", label: "Words" },
  { id: "phrases", label: "Phrases" },
  { id: "proverbs", label: "Proverbs" },
  { id: "idioms", label: "Idioms" },
  { id: "slang", label: "Slang" },
  { id: "sound", label: "Pronunciation" },
];

export function LanguageStudio({ lang }: { lang: Language }) {
  const [tab, setTab] = useState<Tab>("words");
  const [speechReady, setSpeechReady] = useState(false);
  const [native, setNative] = useState(false);

  useEffect(() => {
    warmVoices();
    setSpeechReady(hasSpeech());
    const check = () => setNative(hasNativeVoice(lang.code));
    check();
    const id = setTimeout(check, 600);
    return () => clearTimeout(id);
  }, [lang.code]);

  const counts: Record<Tab, number> = {
    words: lang.words.length, phrases: lang.phrases.length, proverbs: lang.proverbs.length,
    idioms: lang.idioms.length, slang: lang.slang.length, sound: 1,
  };

  return (
    <div>
      <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.filter((t) => counts[t.id] > 0).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
              tab === t.id ? "border-sun-500 bg-sun-500 text-soil-950" : "border-soil-700 bg-soil-900 text-soil-300 hover:border-soil-500 hover:text-soil-100"
            )}
          >
            {t.label}
            {t.id !== "sound" && <span className="ml-1.5 text-[11px] opacity-60">{counts[t.id]}</span>}
          </button>
        ))}
      </div>

      {speechReady && !native && lang.code !== "sasl" && tab !== "sound" && (
        <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-soil-800 bg-soil-900/60 p-3.5 text-xs leading-relaxed text-soil-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          <p>
            Your browser has no {lang.name} voice, so the speaker button falls back to an approximation.
            That is exactly the gap this archive exists to close —{" "}
            <a href={`/contribute?kind=language&about=${lang.code}`} className="font-semibold text-sun-500 underline">
              record yourself saying these properly
            </a>.
          </p>
        </div>
      )}

      {tab === "words" && <Flashcards entries={lang.words} code={lang.code} id={`lang:${lang.code}:words`} />}
      {tab === "phrases" && <EntryList entries={lang.phrases} code={lang.code} />}
      {tab === "proverbs" && <ProverbList items={lang.proverbs} code={lang.code} tone="sun" />}
      {tab === "idioms" && <ProverbList items={lang.idioms} code={lang.code} tone="bead" />}
      {tab === "slang" && <EntryList entries={lang.slang} code={lang.code} />}
      {tab === "sound" && (
        <div className="space-y-4">
          <div className="rounded-card border border-soil-800 bg-soil-900 p-5">
            <h3 className="font-display text-xl text-soil-100">How {lang.name} sounds</h3>
            <p className="mt-2 leading-relaxed text-soil-300">{lang.sound}</p>
          </div>
          {["zul", "xho", "nbl", "ssw"].includes(lang.code) && <ClickTrainer code={lang.code} />}
          <div className="rounded-card border border-soil-800 bg-soil-900 p-5">
            <h3 className="font-display text-xl text-soil-100">Greetings, said out loud</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {lang.greetings.map((g) => (
                <button
                  key={g.term}
                  onClick={() => speak(g.term, lang.code)}
                  className="group flex items-start gap-3 rounded-2xl border border-soil-800 bg-soil-850 p-3.5 text-left transition hover:border-sun-500/50"
                >
                  <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-soil-500 transition group-hover:text-sun-500" />
                  <span>
                    <span className="block font-display text-lg text-soil-100">{g.term}</span>
                    <span className="block text-sm text-soil-400">{g.meaning}</span>
                    {g.note && <span className="mt-1 block text-xs text-soil-600">{g.note}</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- flashcards ----------------------------- */

function Flashcards({ entries, code, id }: { entries: Entry[]; code: string; id: string }) {
  const [order, setOrder] = useState<number[]>(() => entries.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<"cards" | "list">("cards");
  const { markLearned } = useStore();

  const current = entries[order[idx]];
  const atEnd = idx === entries.length - 1;

  const next = () => {
    setFlipped(false);
    if (atEnd) { markLearned(id, 30); setIdx(0); }
    else setIdx((i) => i + 1);
  };
  const prev = () => { setFlipped(false); setIdx((i) => (i === 0 ? entries.length - 1 : i - 1)); };
  const shuffle = () => {
    setOrder((o) => o.slice().sort(() => Math.random() - 0.5));
    setIdx(0); setFlipped(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button onClick={() => setMode("cards")} className={clsx("rounded-full px-3.5 py-1.5 text-xs font-bold transition", mode === "cards" ? "bg-soil-100 text-soil-950" : "bg-soil-800 text-soil-400")}>Flashcards</button>
          <button onClick={() => setMode("list")} className={clsx("rounded-full px-3.5 py-1.5 text-xs font-bold transition", mode === "list" ? "bg-soil-100 text-soil-950" : "bg-soil-800 text-soil-400")}>List</button>
        </div>
        {mode === "cards" && (
          <button onClick={shuffle} className="inline-flex items-center gap-1.5 rounded-full border border-soil-700 px-3 py-1.5 text-xs font-bold text-soil-300 hover:border-soil-500">
            <Shuffle className="h-3.5 w-3.5" /> Shuffle
          </button>
        )}
      </div>

      {mode === "list" ? (
        <EntryList entries={entries} code={code} />
      ) : (
        <>
          <div className="relative">
            <button
              onClick={() => setFlipped((f) => !f)}
              className="group relative flex min-h-[220px] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-card border border-soil-700 bg-gradient-to-br from-soil-850 to-soil-900 p-8 text-center transition active:scale-[0.99]"
            >
              <span className="absolute right-4 top-4 text-[11px] font-bold uppercase tracking-widest text-soil-600">
                {flipped ? "Meaning" : code.toUpperCase()}
              </span>
              <span className="font-display text-3xl leading-tight text-soil-100 sm:text-5xl">
                {flipped ? current.meaning : current.term}
              </span>
              {flipped && current.note && <span className="max-w-md text-sm text-soil-400">{current.note}</span>}
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-soil-500">
                <RotateCw className="h-3.5 w-3.5" /> Tap to flip
              </span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); speak(current.term, code); }}
              aria-label={`Hear ${current.term}`}
              className="absolute bottom-4 left-4 rounded-full border border-soil-700 bg-soil-900 p-2.5 text-soil-400 transition hover:border-sun-500 hover:text-sun-500"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button onClick={prev} className="rounded-full border border-soil-700 p-3 text-soil-300 transition hover:border-soil-500 hover:text-soil-100" aria-label="Previous">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-soil-800">
                <div className="h-full rounded-full bg-sun-500 transition-all duration-300" style={{ width: `${((idx + 1) / entries.length) * 100}%` }} />
              </div>
              <div className="mt-1.5 text-center text-xs tabular-nums text-soil-500">{idx + 1} / {entries.length}</div>
            </div>
            <button onClick={next} className="rounded-full bg-sun-500 p-3 text-soil-950 transition hover:bg-sun-400" aria-label="Next">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------ lists --------------------------------- */

function EntryList({ entries, code }: { entries: Entry[]; code: string }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {entries.map((e) => (
        <li key={e.term}>
          <button
            onClick={() => speak(e.term, code)}
            className="group flex w-full items-start gap-3 rounded-2xl border border-soil-800 bg-soil-900 p-4 text-left transition hover:border-sun-500/50"
          >
            <Volume2 className="mt-1 h-4 w-4 shrink-0 text-soil-600 transition group-hover:text-sun-500" />
            <span className="min-w-0">
              <span className="block font-display text-lg leading-tight text-soil-100">{e.term}</span>
              <span className="block text-sm leading-snug text-soil-400">{e.meaning}</span>
              {e.note && <span className="mt-1 block text-xs leading-snug text-soil-600">{e.note}</span>}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ProverbList({ items, code, tone }: { items: Proverb[]; code: string; tone: "sun" | "bead" }) {
  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div key={p.text} className="rounded-card border border-soil-800 bg-soil-900 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-display text-xl leading-snug text-soil-100 sm:text-2xl">{p.text}</p>
            <button
              onClick={() => speak(p.text, code)}
              aria-label="Hear it"
              className="shrink-0 rounded-full border border-soil-700 p-2 text-soil-500 transition hover:border-sun-500 hover:text-sun-500"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-sm italic text-soil-400">“{p.literal}”</p>
          <Chip tone={tone} className="mt-3">What it means</Chip>
          <p className="mt-2 leading-relaxed text-soil-300">{p.meaning}</p>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- click trainer ---------------------------- */

const CLICKS = [
  { letter: "C", name: "Dental click", how: "Tip of the tongue behind the top front teeth, then pull away sharply. It is the 'tsk tsk' sound of disapproval.", example: "cela — to ask", },
  { letter: "Q", name: "Palatal click", how: "Tongue flat against the roof of the mouth, then snap it down. Like a cork coming out of a bottle.", example: "qala — to begin", },
  { letter: "X", name: "Lateral click", how: "Tongue against the side teeth, pull air in at the side. The sound people make to urge a horse on.", example: "xoxa — to chat", },
];

function ClickTrainer({ code }: { code: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const extra = useMemo(() => code === "xho"
    ? "isiXhosa stacks these three places with voicing, aspiration and nasalisation to produce fifteen distinct click consonants."
    : "Each of these three can also be voiced, aspirated or nasalised, which multiplies them further.", [code]);

  return (
    <div className="rounded-card border border-soil-800 bg-soil-900 p-5">
      <h3 className="font-display text-xl text-soil-100">The three clicks</h3>
      <p className="mt-1.5 text-sm text-soil-400">{extra}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {CLICKS.map((c) => (
          <button
            key={c.letter}
            onClick={() => { setOpen(open === c.letter ? null : c.letter); speak(c.example.split(" — ")[0], code); }}
            className={clsx(
              "rounded-2xl border p-4 text-left transition",
              open === c.letter ? "border-sun-500/60 bg-sun-500/10" : "border-soil-800 bg-soil-850 hover:border-soil-600"
            )}
          >
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl text-sun-500">{c.letter}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-soil-500">{c.name}</span>
            </div>
            <p className="mt-2 text-sm leading-snug text-soil-300">{c.how}</p>
            <p className="mt-2 text-xs font-semibold text-soil-400">{c.example}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
