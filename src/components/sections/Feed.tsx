"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight, Bookmark, Check, ChevronUp, Heart, Link2, MessageCircle,
  Mic, Pause, Play, Plus, Share2, Trash2, Volume2, X,
} from "lucide-react";
import { POSTS } from "@/content/feed";
import { PROVINCE_LABEL } from "@/content";
import type { Post, SectionId } from "@/lib/types";
import { useStore, type LocalPost } from "@/lib/store";
import { clsx, ElderBadge, SeedBadge } from "@/components/ui";
import { Pattern, seedColors } from "@/components/Pattern";

type AnyPost = Post | LocalPost;

const SECTION_HREF: Record<SectionId, string> = {
  games: "/games", languages: "/languages", stories: "/stories", poetry: "/poetry",
  food: "/food", culture: "/culture", map: "/map", feed: "/feed",
};

const KIND_LABEL: Record<Post["kind"], string> = {
  game: "🎮 Game", language: "🗣️ Language", story: "👵🏾 Story",
  poetry: "🎤 Poetry", food: "🍲 Food", culture: "👗 Culture", place: "🗺️ Place",
};

export function Feed() {
  const params = useSearchParams();
  const want = params.get("post");
  const { posts: mine } = useStore();

  const all = useMemo<AnyPost[]>(() => [...mine, ...POSTS], [mine]);
  const scroller = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [jumped, setJumped] = useState(false);

  // Deep link: /feed?post=<id>
  useEffect(() => {
    if (jumped || !want || !scroller.current) return;
    const i = all.findIndex((p) => p.id === want);
    if (i < 0) return;
    const el = scroller.current.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "start" });
    setIdx(i);
    setJumped(true);
  }, [want, all, jumped]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setIdx(Math.round(el.scrollTop / el.clientHeight));
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="no-scrollbar snap-feed h-full w-full overflow-y-auto overscroll-y-contain"
      >
        {all.map((p, i) => (
          <PostCard key={p.id} post={p} active={i === idx} index={i} total={all.length} />
        ))}
        <ComposeCard />
      </div>

      {/* progress rail */}
      <div className="pointer-events-none absolute right-1.5 top-1/2 hidden -translate-y-1/2 flex-col gap-1 sm:flex">
        {all.slice(0, 20).map((_, i) => (
          <span key={i} className={clsx("w-1 rounded-full transition-all", i === idx ? "h-5 bg-soil-100" : "h-1.5 bg-soil-100/25")} />
        ))}
      </div>

      {idx > 0 && (
        <button
          onClick={() => scroller.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute left-1/2 top-[max(1rem,env(safe-area-inset-top))] z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
        >
          <ChevronUp className="mr-1 inline h-3.5 w-3.5" /> Top
        </button>
      )}
    </div>
  );
}

/* ------------------------------ post card ----------------------------- */

function PostCard({ post, active, index, total }: { post: AnyPost; active: boolean; index: number; total: number }) {
  const { isLiked, toggleLike, isSaved, toggleSave, removePost, mediaUrlFor } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const [c1, c2] = seedColors(post.id);
  const local = post.seeded === false;
  const liked = isLiked(post.id);
  const saved = post.link ? isSaved(post.link.section, post.link.slug) : isSaved("feed", post.id);

  useEffect(() => {
    const m = mediaRef.current;
    if (!m) return;
    if (!active) { m.pause(); setPlaying(false); }
  }, [active]);

  const share = async () => {
    const url = `${window.location.origin}/feed?post=${post.id}`;
    try {
      if (navigator.share) await navigator.share({ title: post.caption, url });
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    } catch { /* dismissed */ }
  };

  const mediaUrl = mediaUrlFor(post);

  return (
    <section className="relative flex h-full w-full shrink-0 snap-start snap-always items-end justify-center overflow-hidden">
      {/* backdrop */}
      {mediaUrl && post.mediaKind === "video" ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          loop
          onClick={() => {
            const m = mediaRef.current; if (!m) return;
            if (m.paused) { void m.play(); setPlaying(true); } else { m.pause(); setPlaying(false); }
          }}
        />
      ) : (
        <>
          <Pattern seed={post.id} className="absolute inset-0 h-full w-full opacity-40" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(120% 70% at 50% 0%, ${c1}2e, transparent 62%)` }} />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/55" />

      {/* audio-only play affordance */}
      {(post.mediaKind === "audio" || (post.mediaKind === "video" && !mediaUrl)) && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {mediaUrl ? (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={mediaUrl} loop />
              <button
                onClick={() => {
                  const m = mediaRef.current; if (!m) return;
                  if (m.paused) { void m.play(); setPlaying(true); } else { m.pause(); setPlaying(false); }
                }}
                className="pointer-events-auto grid h-20 w-20 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-sm transition active:scale-95"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="h-8 w-8 fill-current" /> : <Play className="ml-1 h-8 w-8 fill-current" />}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-80">
              <div className="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-black/30 backdrop-blur-sm">
                {post.mediaKind === "audio" ? <Volume2 className="h-7 w-7 text-white" /> : <Play className="ml-1 h-7 w-7 fill-white text-white" />}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                {post.mediaKind} · {post.duration}
              </p>
            </div>
          )}
        </div>
      )}

      {/* counter */}
      <div className="absolute left-4 top-[max(4.5rem,calc(env(safe-area-inset-top)+4rem))] z-10 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-bold tabular-nums text-white/70 backdrop-blur">
        {index + 1} / {total}
      </div>

      {/* right rail */}
      <div className="absolute bottom-28 right-3 z-20 flex flex-col items-center gap-5 sm:bottom-24">
        <RailButton
          onClick={() => toggleLike(post.id)}
          active={liked}
          activeClass="text-clay-500"
          icon={<Heart className={clsx("h-7 w-7", liked && "fill-current")} />}
          label={String(post.likes + (liked ? 1 : 0))}
        />
        <RailButton
          onClick={() => setShowComments(true)}
          icon={<MessageCircle className="h-7 w-7" />}
          label={String(post.comments.length)}
        />
        <RailButton
          onClick={() => (post.link ? toggleSave(post.link.section, post.link.slug) : toggleSave("feed", post.id))}
          active={saved}
          activeClass="text-sun-500"
          icon={<Bookmark className={clsx("h-7 w-7", saved && "fill-current")} />}
          label={saved ? "Saved" : "Save"}
        />
        <RailButton
          onClick={share}
          icon={copied ? <Check className="h-7 w-7" /> : <Share2 className="h-7 w-7" />}
          label={copied ? "Copied" : "Share"}
        />
        {local && (
          <RailButton
            onClick={() => { if (confirm("Delete this post?")) removePost(post.id); }}
            icon={<Trash2 className="h-6 w-6" />}
            label="Delete"
          />
        )}
      </div>

      {/* caption block */}
      <div className="relative z-10 w-full max-w-xl px-4 pb-24 pr-20 sm:pb-20">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full font-display text-base text-black"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            {post.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate font-bold text-white">
              {post.handle}
              {post.elder && <ElderBadge />}
            </p>
            <p className="truncate text-xs text-white/60">{post.place}, {PROVINCE_LABEL[post.province]}</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            {KIND_LABEL[post.kind]}
          </span>
        </div>

        <p className="mt-3 text-pretty text-lg font-semibold leading-snug text-white">{post.caption}</p>
        {post.body && <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-white/70">{post.body}</p>}

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold text-white/55">
          {post.tags.map((t) => <span key={t}>#{t}</span>)}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {post.seeded ? <SeedBadge synthetic={!!mediaUrl} /> : (
            <span className="rounded-full bg-veld-500/20 px-2.5 py-1 text-[11px] font-bold text-veld-400">Your recording</span>
          )}
          {post.link && (
            <Link
              href={`${SECTION_HREF[post.link.section]}${post.link.section === "map" ? `?place=${post.link.slug}` : `/${post.link.slug}`}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              {post.link.label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {showComments && <Comments post={post} onClose={() => setShowComments(false)} />}
    </section>
  );
}

function RailButton({ onClick, icon, label, active, activeClass }: {
  onClick: () => void; icon: React.ReactNode; label: string; active?: boolean; activeClass?: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 transition active:scale-90">
      <span className={clsx("drop-shadow-lg transition-colors", active ? activeClass : "text-white")}>{icon}</span>
      <span className="text-[11px] font-bold text-white/85 drop-shadow">{label}</span>
    </button>
  );
}

/* ------------------------------ comments ------------------------------ */

function Comments({ post, onClose }: { post: AnyPost; onClose: () => void }) {
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<{ who: string; text: string }[]>([]);
  const all = [...post.comments, ...extra];

  return (
    <div className="absolute inset-0 z-40 flex items-end" role="dialog" aria-modal="true" aria-label="Comments">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close comments" />
      <div className="animate-rise relative flex max-h-[72%] w-full flex-col rounded-t-3xl border-t border-soil-800 bg-soil-950">
        <div className="flex shrink-0 items-center justify-between border-b border-soil-800 px-5 py-3.5">
          <h3 className="font-display text-xl text-soil-100">{all.length} comment{all.length === 1 ? "" : "s"}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-soil-400 hover:text-soil-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="thin-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {all.length === 0 && <p className="py-8 text-center text-sm text-soil-500">No comments yet. Say something kind.</p>}
          {all.map((c, i) => {
            const [a] = seedColors(c.who);
            return (
              <div key={i} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-black" style={{ background: a }}>
                  {c.who.replace("@", "").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-soil-300">{c.who}</p>
                  <p className="text-sm leading-relaxed text-soil-200">{c.text}</p>
                </div>
              </div>
            );
          })}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const t = draft.trim();
            if (!t) return;
            setExtra((x) => [...x, { who: "@you", text: t }]);
            setDraft("");
          }}
          className="flex shrink-0 items-center gap-2 border-t border-soil-800 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 rounded-full border border-soil-700 bg-soil-900 px-4 py-2.5 text-sm text-soil-100 placeholder:text-soil-600 focus:border-sun-500 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-sun-500 px-4 py-2.5 text-sm font-bold text-soil-950 disabled:opacity-40" disabled={!draft.trim()}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------- compose card ---------------------------- */

function ComposeCard() {
  return (
    <section className="relative flex h-full w-full shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Pattern seed="contribute-end" className="absolute inset-0 h-full w-full opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/80" />
      <div className="relative">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-veld-500/40 bg-veld-500/15">
          <Mic className="h-8 w-8 text-veld-400" />
        </div>
        <h2 className="mt-6 font-display text-4xl leading-tight text-white">That is the whole feed.</h2>
        <p className="mx-auto mt-3 max-w-sm text-pretty leading-relaxed text-white/70">
          Which means the next thing in it is yours. A song, a recipe, a word your family uses
          that nobody else does, your gogo talking for ninety seconds.
        </p>
        <Link
          href="/contribute"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-veld-500 px-6 py-3.5 font-bold text-soil-950 transition hover:bg-veld-400"
        >
          <Plus className="h-5 w-5" /> Add to the archive
        </Link>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/40">
          <Link2 className="h-3 w-3" /> Every post links back to the archive entry it belongs to
        </p>
      </div>
    </section>
  );
}
