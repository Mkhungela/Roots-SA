"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark, Gamepad2, Home, Map as MapIcon, Mic, Plus, Search, Utensils,
  BookOpen, Shirt, Languages as LangIcon, X,
} from "lucide-react";
import { SECTIONS, search as runSearch, type SearchHit } from "@/content";
import { clsx } from "./ui";
import { useStore } from "@/lib/store";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  games: Gamepad2, languages: LangIcon, stories: BookOpen, poetry: Mic,
  food: Utensils, culture: Shirt, map: MapIcon, feed: Home,
};

const SECTION_HREF: Record<string, string> = {
  games: "/games", languages: "/languages", stories: "/stories", poetry: "/poetry",
  food: "/food", culture: "/culture", map: "/map", feed: "/feed",
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-clay-500">
        <span className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#f5a623_0_6px,transparent_6px_12px)] opacity-60" />
        <span className="relative font-display text-base font-extrabold text-soil-950">R</span>
      </span>
      {!compact && (
        <span className="font-display text-lg font-extrabold tracking-tight text-soil-100">
          ROOTS <span className="text-sun-500">SA</span>
        </span>
      )}
    </Link>
  );
}

/* ------------------------------ search -------------------------------- */

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 40); }, [open]);
  useEffect(() => { setHits(runSearch(q)); }, [q]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] animate-fade bg-soil-950/90 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto mt-[12vh] w-[min(640px,92vw)]" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden rounded-3xl border border-soil-700 bg-soil-900 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-soil-800 px-5">
            <Search className="h-5 w-5 shrink-0 text-soil-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search games, words, recipes, places, stories…"
              className="w-full bg-transparent py-4 text-base text-soil-100 outline-none placeholder:text-soil-600"
            />
            <button onClick={onClose} className="rounded-lg p-1.5 text-soil-500 hover:bg-soil-800 hover:text-soil-200" aria-label="Close search">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="thin-scrollbar max-h-[55vh] overflow-y-auto">
            {q.length < 2 ? (
              <div className="px-5 py-8 text-center text-sm text-soil-500">
                Try <button onClick={() => setQ("diketo")} className="text-sun-500 underline">diketo</button>,{" "}
                <button onClick={() => setQ("umngqusho")} className="text-sun-500 underline">umngqusho</button>,{" "}
                <button onClick={() => setQ("ubuntu")} className="text-sun-500 underline">ubuntu</button> or{" "}
                <button onClick={() => setQ("lobola")} className="text-sun-500 underline">lobola</button>
              </div>
            ) : hits.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-soil-500">
                Nothing yet for “{q}”. The archive grows when people contribute.
              </div>
            ) : (
              <ul className="p-2">
                {hits.map((h) => {
                  const Icon = ICONS[h.section] ?? Home;
                  const href = h.section === "map" ? `/map?place=${h.slug}` : `${SECTION_HREF[h.section]}/${h.slug}`;
                  return (
                    <li key={`${h.section}-${h.slug}`}>
                      <Link href={href} onClick={onClose} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-soil-800">
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-soil-800 text-soil-400">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-soil-100">{h.title}</span>
                          <span className="block truncate text-xs text-soil-500">{h.subtitle}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- shell -------------------------------- */

const MOBILE_TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/contribute", label: "Add", icon: Plus },
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/feed", label: "Feed", icon: Mic },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { saves, xp, ready, live, account } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isFeed = pathname === "/feed";

  return (
    <div className="min-h-dvh">
      {/* ---------- desktop rail ---------- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-soil-800 bg-soil-900/60 backdrop-blur lg:flex">
        <div className="px-5 py-5"><Logo /></div>
        <button
          onClick={() => setSearchOpen(true)}
          className="mx-4 mb-4 flex items-center gap-2.5 rounded-xl border border-soil-700 bg-soil-850 px-3 py-2.5 text-sm text-soil-500 transition hover:border-soil-600 hover:text-soil-300"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="rounded border border-soil-700 px-1.5 py-0.5 text-[10px] text-soil-600">⌘K</kbd>
        </button>
        <nav className="thin-scrollbar flex-1 overflow-y-auto px-3">
          {SECTIONS.map((s) => {
            const Icon = ICONS[s.id] ?? Home;
            const active = pathname === s.href || pathname.startsWith(s.href + "/");
            return (
              <Link
                key={s.id}
                href={s.href}
                className={clsx(
                  "group mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                  active ? "bg-soil-800 text-soil-100" : "text-soil-400 hover:bg-soil-850 hover:text-soil-200"
                )}
              >
                <span className="shrink-0" style={active ? { color: s.accent } : undefined}><Icon className="h-[18px] w-[18px]" /></span>
                <span className="flex-1 truncate">{s.label}</span>
                <span className="text-[11px] tabular-nums text-soil-600">{s.count}</span>
              </Link>
            );
          })}
          <div className="my-3 h-px bg-soil-800" />
          <Link href="/saved" className={clsx("mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            pathname === "/saved" ? "bg-soil-800 text-soil-100" : "text-soil-400 hover:bg-soil-850 hover:text-soil-200")}>
            <Bookmark className="h-[18px] w-[18px]" />
            <span className="flex-1">Saved</span>
            {ready && saves.length > 0 && <span className="text-[11px] tabular-nums text-sun-500">{saves.length}</span>}
          </Link>
          <Link href="/about" className={clsx("mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
            pathname === "/about" ? "bg-soil-800 text-soil-100" : "text-soil-400 hover:bg-soil-850 hover:text-soil-200")}>
            <BookOpen className="h-[18px] w-[18px]" />
            <span className="flex-1">About</span>
          </Link>
        </nav>
        <div className="p-4">
          <Link
            href="/contribute"
            className="flex items-center justify-center gap-2 rounded-xl bg-clay-500 px-4 py-3 text-sm font-bold text-soil-100 transition hover:bg-clay-400 active:scale-[0.98]"
          >
            <Mic className="h-4 w-4" /> Contribute
          </Link>
          {ready && xp > 0 && (
            <div className="mt-3 text-center text-[11px] uppercase tracking-widest text-soil-600">
              <span className="text-sun-500">{xp}</span> XP earned
            </div>
          )}
          {ready && (
            <Link
              href="/saved"
              title={live
                ? (account ? `Signed in as ${account.email}` : "Not signed in — tap to sign in")
                : "Archive mode: no account server, everything stays in this browser"}
              className="mt-3 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-soil-600 transition hover:bg-soil-850 hover:text-soil-400"
            >
              <span className={clsx("h-1.5 w-1.5 rounded-full", live && account ? "bg-veld-500" : live ? "bg-sun-500" : "bg-soil-600")} />
              {live ? (account ? account.email.split("@")[0] : "Sign in") : "On this device"}
            </Link>
          )}
        </div>
      </aside>

      {/* ---------- mobile top bar ---------- */}
      <header className={clsx(
        "sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-soil-800 bg-soil-950/85 px-4 py-3 backdrop-blur lg:hidden",
        isFeed && "border-transparent bg-transparent"
      )}>
        <Logo />
        <div className="flex items-center gap-1">
          <button onClick={() => setSearchOpen(true)} aria-label="Search" className="rounded-xl p-2.5 text-soil-300 hover:bg-soil-850">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/saved" aria-label="Saved" className="relative rounded-xl p-2.5 text-soil-300 hover:bg-soil-850">
            <Bookmark className="h-5 w-5" />
            {ready && saves.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sun-500" />
            )}
          </Link>
        </div>
      </header>

      {/* ---------- content ---------- */}
      <main className={clsx("lg:pl-60", !isFeed && "pb-24 lg:pb-0")}>{children}</main>

      {/* ---------- mobile tab bar ---------- */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-soil-800 bg-soil-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className="grid grid-cols-5">
          {MOBILE_TABS.map((t) => {
            const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
            const isAdd = t.href === "/contribute";
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={clsx(
                    "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition",
                    active ? "text-sun-500" : "text-soil-500"
                  )}
                >
                  <span className={clsx("grid place-items-center", isAdd && "h-8 w-8 -translate-y-1 rounded-xl bg-clay-500 text-soil-100")}>
                    <t.icon className={isAdd ? "h-5 w-5" : "h-5 w-5"} />
                  </span>
                  <span className={isAdd ? "-mt-1" : ""}>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
