"use client";

import Link from "next/link";
import { Bookmark, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import type { SectionId } from "@/lib/types";
import { Pattern, seedColors } from "./Pattern";

export function clsx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------- chips -------------------------------- */

export function Chip({
  children, tone = "soil", className = "",
}: { children: React.ReactNode; tone?: "soil" | "sun" | "clay" | "veld" | "ink" | "bead"; className?: string }) {
  const tones = {
    soil: "bg-soil-800 text-soil-300 border-soil-700",
    sun: "bg-sun-500/15 text-sun-400 border-sun-500/30",
    clay: "bg-clay-500/15 text-clay-400 border-clay-500/30",
    veld: "bg-veld-500/15 text-veld-400 border-veld-500/30",
    ink: "bg-ink-500/15 text-ink-400 border-ink-500/30",
    bead: "bg-bead-500/15 text-bead-400 border-bead-500/30",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}

/** Marks illustrative seeded content so it is never mistaken for a real recording. */
export function SeedBadge({ className = "", synthetic = false }: { className?: string; synthetic?: boolean }) {
  return (
    <span
      title={
        synthetic
          ? "A sample entry with a machine-read voice, standing in until a real recording replaces it."
          : "A written sample entry, not a recording of a real person. It is here to show the shape of the thing."
      }
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-sun-500/30 bg-sun-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sun-500",
        className
      )}
    >
      {synthetic ? "Sample · machine-read" : "Sample archive entry"}
    </span>
  );
}

export function ElderBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sun-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sun-400">
      Elder
    </span>
  );
}

/* ---------------------------- save button ----------------------------- */

export function SaveButton({
  section, slug, label = false,
}: { section: SectionId; slug: string; label?: boolean }) {
  const { isSaved, toggleSave, ready } = useStore();
  const on = ready && isSaved(section, slug);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(section, slug); }}
      aria-pressed={on}
      aria-label={on ? "Remove from saved" : "Save to your archive"}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition active:scale-95",
        on ? "border-sun-500/50 bg-sun-500/20 text-sun-400" : "border-soil-700 bg-soil-900/70 text-soil-300 hover:border-soil-500 hover:text-soil-100"
      )}
    >
      <Bookmark className={clsx("h-4 w-4", on && "fill-current")} />
      {label && <span>{on ? "Saved" : "Save"}</span>}
    </button>
  );
}

/* ------------------------------- cards -------------------------------- */

export function ArtCard({
  href, seed, eyebrow, title, subtitle, footer, tall = false, children,
}: {
  href: string; seed: string; eyebrow?: React.ReactNode; title: string;
  subtitle?: string; footer?: React.ReactNode; tall?: boolean; children?: React.ReactNode;
}) {
  const [c1] = seedColors(seed);
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-card border border-soil-800 bg-soil-900 transition duration-300 hover:-translate-y-1 hover:border-soil-600"
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset" }}
    >
      <div className={clsx("relative overflow-hidden", tall ? "aspect-[4/5]" : "aspect-[16/10]")}>
        <Pattern seed={seed} className="absolute inset-0 h-full w-full opacity-[0.66] transition duration-500 group-hover:opacity-85 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/40 to-transparent" />
        {eyebrow && <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">{eyebrow}</div>}
        {children}
      </div>
      <div className="relative -mt-10 flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-lg leading-tight text-soil-100">{title}</h3>
        {subtitle && <p className="line-clamp-2 text-sm leading-snug text-soil-400">{subtitle}</p>}
        {footer && <div className="mt-auto pt-3 text-xs text-soil-500">{footer}</div>}
      </div>
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: c1 }}
      />
    </Link>
  );
}

/* ---------------------------- page header ----------------------------- */

export function PageHeader({
  emoji, kicker, title, lead, accent = "#f5a623", children,
}: {
  emoji: string; kicker: string; title: string; lead: string; accent?: string; children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-soil-800">
      <div
        className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ background: accent }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-14">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="text-lg">{emoji}</span>
          {kicker}
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.05] text-soil-100 sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-soil-300 sm:text-lg">{lead}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </header>
  );
}

export function Section({
  title, kicker, action, children, className = "",
}: { title?: string; kicker?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={clsx("mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12", className)}>
      {title && (
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            {kicker && (
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-soil-500">{kicker}</p>
            )}
            <h2 className="font-display text-2xl text-soil-100 sm:text-3xl">{title}</h2>
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ------------------------------ filters -------------------------------- */

export function FilterRow<T extends string>({
  options, value, onChange, allLabel = "All",
}: {
  options: { id: T; label: string; emoji?: string }[];
  value: T | "all";
  onChange: (v: T | "all") => void;
  allLabel?: string;
}) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
      {([{ id: "all" as const, label: allLabel }, ...options]).map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id as T | "all")}
          className={clsx(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
            value === o.id
              ? "border-sun-500 bg-sun-500 text-soil-950"
              : "border-soil-700 bg-soil-900 text-soil-300 hover:border-soil-500 hover:text-soil-100"
          )}
        >
          {"emoji" in o && o.emoji ? `${o.emoji} ` : ""}{o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ misc ----------------------------------- */

export function Stat({ value, label, icon }: { value: string | number; label: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-soil-800 bg-soil-900/60 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-soil-500">
        {icon}{label}
      </div>
      <div className="mt-0.5 font-display text-xl leading-tight text-soil-100 sm:text-2xl">{value}</div>
    </div>
  );
}

export function BeadRule({ className = "" }: { className?: string }) {
  return <div className={clsx("bead-rule w-full", className)} />;
}

export function LearnedTick({ id, xp = 25, label = "Mark as learned" }: { id: string; xp?: number; label?: string }) {
  const { hasLearned, markLearned, ready } = useStore();
  const done = ready && hasLearned(id);
  return (
    <button
      onClick={() => markLearned(id, xp)}
      disabled={done}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition active:scale-95",
        done
          ? "border-veld-500/50 bg-veld-500/20 text-veld-400"
          : "border-soil-700 bg-soil-900 text-soil-200 hover:border-veld-500/60 hover:text-veld-400"
      )}
    >
      <Check className="h-4 w-4" />
      {done ? `Learned · +${xp} XP` : label}
    </button>
  );
}
