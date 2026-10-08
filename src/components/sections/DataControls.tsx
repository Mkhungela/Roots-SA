"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Cloud, Database, HardDrive, LogOut, Mail, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { mediaBytes, mediaSupported } from "@/lib/media-store";
import { clsx } from "@/components/ui";

const fmtBytes = (n: number) => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};

type Part = "likes" | "saves" | "learned" | "posts";

export function DataControls() {
  const { likes, saves, learned, posts, xp, live, account, authBusy, signIn, signOut, clearAll, clearPart, ready } = useStore();
  const [confirming, setConfirming] = useState<Part | "all" | null>(null);
  const [bytes, setBytes] = useState<number | null>(null);
  const [lsBytes, setLsBytes] = useState(0);
  const [email, setEmail] = useState("");
  const [authMsg, setAuthMsg] = useState<{ ok: boolean; message: string } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const measure = () => {
    if (mediaSupported()) void mediaBytes().then(setBytes);
    try {
      const raw = window.localStorage.getItem("roots-sa:v1") ?? "";
      setLsBytes(new Blob([raw]).size);
    } catch { /* private mode */ }
  };

  useEffect(() => { if (ready) measure(); }, [ready, posts.length, saves.length, likes.length, learned.length]);

  const run = async (what: Part | "all") => {
    if (what === "all") await clearAll(); else await clearPart(what);
    setConfirming(null);
    setFlash(what === "all" ? "Everything cleared." : `Cleared your ${what}.`);
    setTimeout(() => setFlash(null), 2600);
    setTimeout(measure, 120);
  };

  const rows: { part: Part; label: string; n: number; note: string }[] = [
    { part: "saves", label: "Saved entries", n: saves.length, note: "Bookmarks across all eight sections" },
    { part: "likes", label: "Likes", n: likes.length, note: "Hearts on feed posts" },
    { part: "learned", label: "Learning progress", n: learned.length, note: `Learned ticks and all ${xp} XP` },
    { part: "posts", label: "Your recordings", n: posts.length, note: bytes === null ? "Audio and video you added" : `Audio and video you added · ${fmtBytes(bytes)}` },
  ];

  const total = likes.length + saves.length + learned.length + posts.length;

  return (
    <section className="space-y-4">
      {/* account */}
      <div className="rounded-card border border-soil-800 bg-soil-900 p-5">
        <div className="flex items-start gap-3">
          {live ? <Cloud className="mt-0.5 h-5 w-5 text-sky-cyan" /> : <HardDrive className="mt-0.5 h-5 w-5 text-soil-500" />}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-xl text-soil-100">
              {live ? (account ? "Signed in" : "Shared archive") : "This device only"}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-soil-400">
              {!live
                ? "No account server is connected, so there is no sign-in and nothing leaves your browser. Saves, XP and recordings live in this browser's storage and will be gone if you clear site data or switch device."
                : account
                  ? `You are signed in as ${account.email}. Saves and recordings sync to your account.`
                  : "Sign in to attribute what you contribute, sync across devices, and keep the right to take it down later."}
            </p>

            {live && !account && (
              <form
                onSubmit={async (e) => { e.preventDefault(); setAuthMsg(await signIn(email)); }}
                className="mt-4 flex flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-soil-700 bg-soil-850 px-4 py-2.5 text-sm text-soil-100 placeholder:text-soil-600 focus:border-sun-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={authBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sun-500 px-5 py-2.5 text-sm font-bold text-soil-950 transition hover:bg-sun-400 disabled:opacity-50"
                >
                  <Mail className="h-4 w-4" /> {authBusy ? "Sending…" : "Email me a link"}
                </button>
              </form>
            )}
            {authMsg && (
              <p className={clsx("mt-2 text-sm", authMsg.ok ? "text-veld-400" : "text-clay-400")}>{authMsg.message}</p>
            )}

            {account && (
              <button
                onClick={() => void signOut()}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-soil-700 px-4 py-2 text-sm font-semibold text-soil-200 transition hover:border-soil-500"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* data */}
      <div className="overflow-hidden rounded-card border border-soil-800 bg-soil-900">
        <div className="flex items-center justify-between gap-3 border-b border-soil-800 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Database className="h-4 w-4 text-soil-500" />
            <h3 className="font-display text-xl text-soil-100">Your data</h3>
          </div>
          <span className="text-xs tabular-nums text-soil-500">
            {fmtBytes(lsBytes)}{bytes ? ` + ${fmtBytes(bytes)} media` : ""}
          </span>
        </div>

        <ul className="divide-y divide-soil-800">
          {rows.map((r) => (
            <li key={r.part} className="flex items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-soil-100">
                  {r.label} <span className="ml-1 text-sm tabular-nums text-soil-500">{r.n}</span>
                </p>
                <p className="text-xs text-soil-500">{r.note}</p>
              </div>
              {confirming === r.part ? (
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => void run(r.part)} className="rounded-full bg-clay-500 px-3 py-1.5 text-xs font-bold text-white">Yes, clear</button>
                  <button onClick={() => setConfirming(null)} className="rounded-full border border-soil-700 px-3 py-1.5 text-xs font-bold text-soil-300">Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirming(r.part)}
                  disabled={r.n === 0}
                  className="shrink-0 rounded-full border border-soil-700 px-3 py-1.5 text-xs font-bold text-soil-300 transition hover:border-clay-500 hover:text-clay-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-soil-700 disabled:hover:text-soil-300"
                >
                  Clear
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="border-t border-soil-800 bg-soil-950/40 px-5 py-4">
          {confirming === "all" ? (
            <div className="flex flex-wrap items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-clay-500" />
              <p className="flex-1 text-sm leading-snug text-soil-200">
                This deletes every save, like, learned tick, all {xp} XP and {posts.length} recording{posts.length === 1 ? "" : "s"} — from this browser{account ? " and from your account" : ""}. It cannot be undone.
              </p>
              <div className="flex gap-2">
                <button onClick={() => void run("all")} className="rounded-full bg-clay-500 px-4 py-2 text-sm font-bold text-white">Delete everything</button>
                <button onClick={() => setConfirming(null)} className="rounded-full border border-soil-700 px-4 py-2 text-sm font-bold text-soil-300">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirming("all")}
              disabled={total === 0}
              className="inline-flex items-center gap-2 text-sm font-bold text-clay-500 transition hover:text-clay-400 disabled:cursor-not-allowed disabled:text-soil-600"
            >
              <Trash2 className="h-4 w-4" /> {total === 0 ? "Nothing stored yet" : "Clear everything"}
            </button>
          )}
        </div>
      </div>

      {flash && (
        <p className="animate-fade rounded-2xl border border-veld-500/30 bg-veld-500/10 px-4 py-3 text-sm font-semibold text-veld-400">
          {flash}
        </p>
      )}
    </section>
  );
}
