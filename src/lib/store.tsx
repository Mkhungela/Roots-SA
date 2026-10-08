"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { clearMedia, deleteMedia, getMedia, putMedia } from "@/lib/media-store";
import type { Post, SectionId } from "@/lib/types";

/**
 * Client state for everything a visitor does: likes, saves, their own contributions and
 * the small amount of learning progress the app tracks.
 *
 * In archive mode this persists to localStorage so the app is fully usable with no
 * backend. When Supabase keys are present the same actions are mirrored to Supabase for
 * the signed-in user, and their rows are hydrated on load.
 *
 * Recordings never go into localStorage. The blob lives in IndexedDB keyed by post id
 * (see lib/media-store) and an object URL is minted for the current session only — a
 * `blob:` URL does not survive a reload, which is why storing one would be a bug.
 */

const KEY = "roots-sa:v1";

export type SavedRef = { section: SectionId; slug: string; at: number };

export type LocalPost = Omit<Post, "seeded"> & {
  seeded: false;
  createdAt: number;
  /** IndexedDB key for the recording, when there is one. */
  mediaKey?: string;
  /** Remote URL once the recording has been uploaded to Supabase Storage. */
  remoteUrl?: string;
};

export type Account = { id: string; email: string } | null;

type State = {
  likes: string[];
  saves: SavedRef[];
  posts: LocalPost[];
  learned: string[];
  xp: number;
};

const EMPTY: State = { likes: [], saves: [], posts: [], learned: [], xp: 0 };

type Ctx = State & {
  ready: boolean;
  /** True when Supabase credentials are present, i.e. the shared archive is reachable. */
  live: boolean;
  account: Account;
  authBusy: boolean;
  signIn: (email: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  isSaved: (section: SectionId, slug: string) => boolean;
  toggleSave: (section: SectionId, slug: string) => void;
  addPost: (
    p: Omit<LocalPost, "id" | "createdAt" | "seeded" | "likes" | "comments" | "mediaKey" | "mediaUrl">
      & { blob?: Blob | null }
  ) => Promise<LocalPost>;
  removePost: (id: string) => void;
  markLearned: (id: string, xp?: number) => void;
  hasLearned: (id: string) => boolean;
  /** Playable URL for a post's recording in this session, if it still exists. */
  mediaUrlFor: (post: { id: string; mediaKey?: string; remoteUrl?: string; mediaUrl?: string }) => string | undefined;
  /** Wipes likes, saves, learning progress, XP and every recording. Irreversible. */
  clearAll: () => Promise<void>;
  /** Removes one category of local data. */
  clearPart: (part: "likes" | "saves" | "learned" | "posts") => Promise<void>;
};

const StoreContext = createContext<Ctx | null>(null);

function read(): State {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      ...EMPTY,
      ...parsed,
      // Drop any dead blob: URL left behind by an older build.
      posts: (parsed.posts ?? []).map((p) => {
        const { mediaUrl, ...rest } = p as LocalPost & { mediaUrl?: string };
        return (mediaUrl && mediaUrl.startsWith("blob:") ? rest : p) as LocalPost;
      }),
    };
  } catch {
    return EMPTY;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);
  const [account, setAccount] = useState<Account>(null);
  const [authBusy, setAuthBusy] = useState(false);
  /** post id -> object URL for this session. */
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const minted = useRef<string[]>([]);

  // Hydrate after mount so server and client markup match.
  useEffect(() => {
    const s = read();
    setState(s);
    setReady(true);

    // Re-mint object URLs for recordings held in IndexedDB.
    void (async () => {
      const next: Record<string, string> = {};
      for (const p of s.posts) {
        if (!p.mediaKey) continue;
        const blob = await getMedia(p.mediaKey);
        if (!blob) continue;
        const url = URL.createObjectURL(blob);
        minted.current.push(url);
        next[p.id] = url;
      }
      if (Object.keys(next).length) setMediaUrls((m) => ({ ...m, ...next }));
    })();

    return () => {
      minted.current.forEach((u) => URL.revokeObjectURL(u));
      minted.current = [];
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — the session still works, it just will not persist */
    }
  }, [state, ready]);

  /* ------------------------------- auth -------------------------------- */

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const client = createClient();
    if (!client) return;
    void client.auth.getUser().then(({ data }) => {
      if (data.user) setAccount({ id: data.user.id, email: data.user.email ?? "" });
    });
    const { data: sub } = client.auth.onAuthStateChange((_e, session) => {
      setAccount(session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      return {
        ok: false,
        message:
          "This copy is running on the bundled archive, so there is no account server to sign in to. Everything you do is kept on this device.",
      };
    }
    const client = createClient();
    if (!client) return { ok: false, message: "Could not reach the archive." };
    setAuthBusy(true);
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/saved` },
    });
    setAuthBusy(false);
    return error
      ? { ok: false, message: error.message }
      : { ok: true, message: `Check ${email} for a sign-in link.` };
  }, []);

  const signOut = useCallback(async () => {
    const client = createClient();
    if (client) await client.auth.signOut();
    setAccount(null);
  }, []);

  /** Mirror an action to Supabase when it is configured and the visitor is signed in. */
  const mirror = useCallback(async (fn: (c: NonNullable<ReturnType<typeof createClient>>, uid: string) => Promise<unknown>) => {
    if (!isSupabaseConfigured) return;
    const client = createClient();
    if (!client) return;
    const { data } = await client.auth.getUser();
    if (!data.user) return;
    try {
      await fn(client, data.user.id);
    } catch {
      /* non-fatal: local state is already updated */
    }
  }, []);

  /* ------------------------------ actions ------------------------------ */

  const toggleLike = useCallback((id: string) => {
    setState((s) => {
      const on = s.likes.includes(id);
      void mirror(async (c, uid) => {
        if (on) await c.from("likes").delete().match({ post_id: id, user_id: uid });
        else await c.from("likes").insert({ post_id: id, user_id: uid });
      });
      return { ...s, likes: on ? s.likes.filter((x) => x !== id) : [...s.likes, id] };
    });
  }, [mirror]);

  const toggleSave = useCallback((section: SectionId, slug: string) => {
    setState((s) => {
      const on = s.saves.some((x) => x.section === section && x.slug === slug);
      void mirror(async (c, uid) => {
        if (on) await c.from("saves").delete().match({ user_id: uid, section, slug });
        else await c.from("saves").insert({ user_id: uid, section, slug });
      });
      return {
        ...s,
        saves: on
          ? s.saves.filter((x) => !(x.section === section && x.slug === slug))
          : [{ section, slug, at: Date.now() }, ...s.saves],
      };
    });
  }, [mirror]);

  const addPost: Ctx["addPost"] = useCallback(async ({ blob, ...p }) => {
    const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    let mediaKey: string | undefined;

    if (blob) {
      const stored = await putMedia(id, blob);
      if (stored) {
        mediaKey = id;
        const url = URL.createObjectURL(blob);
        minted.current.push(url);
        setMediaUrls((m) => ({ ...m, [id]: url }));
      }
    }

    const post: LocalPost = { ...p, id, createdAt: Date.now(), seeded: false, likes: 0, comments: [], mediaKey };
    setState((s) => ({ ...s, posts: [post, ...s.posts], xp: s.xp + 50 }));

    void mirror(async (c, uid) => {
      // The schema stores the object path inside the `media` bucket, not a URL,
      // so the bucket can be flipped to private without rewriting every row.
      let mediaPath: string | null = null;
      if (blob) {
        const ext = blob.type.includes("mp4") ? "mp4"
          : blob.type.includes("webm") ? "webm"
            : blob.type.startsWith("image") ? "jpg"
              : blob.type.includes("mpeg") ? "mp3" : "bin";
        const path = `${uid}/${id}.${ext}`;
        const { error } = await c.storage.from("media").upload(path, blob, { contentType: blob.type, upsert: true });
        if (!error) {
          mediaPath = path;
          const url = c.storage.from("media").getPublicUrl(path).data.publicUrl;
          setState((s) => ({ ...s, posts: s.posts.map((x) => (x.id === id ? { ...x, remoteUrl: url } : x)) }));
        }
      }
      await c.from("posts").insert({
        author_id: uid,
        kind: post.kind === "place" ? "map" : post.kind === "game" ? "games" : post.kind === "language" ? "languages" : post.kind === "story" ? "stories" : post.kind === "poetry" ? "poetry" : post.kind === "food" ? "food" : "culture",
        media_kind: post.mediaKind,
        media_path: mediaPath,
        caption: post.caption,
        body: post.body ?? null,
        place: post.place,
        province: post.province,
        duration: post.duration,
        tags: post.tags,
        link_section: post.link?.section ?? null,
        link_slug: post.link?.slug ?? null,
      });
    });

    return post;
  }, [mirror]);

  const removePost = useCallback((id: string) => {
    setState((s) => {
      const post = s.posts.find((p) => p.id === id);
      if (post?.mediaKey) void deleteMedia(post.mediaKey);
      return { ...s, posts: s.posts.filter((p) => p.id !== id) };
    });
    setMediaUrls((m) => {
      if (m[id]) URL.revokeObjectURL(m[id]);
      const { [id]: _gone, ...rest } = m;
      return rest;
    });
    void mirror(async (c) => { await c.from("posts").delete().eq("id", id); });
  }, [mirror]);

  const markLearned = useCallback((id: string, xp = 25) => {
    setState((s) => (s.learned.includes(id) ? s : { ...s, learned: [...s.learned, id], xp: s.xp + xp }));
  }, []);

  /* ------------------------------ clearing ----------------------------- */

  const clearAll = useCallback(async () => {
    await clearMedia();
    Object.values(mediaUrls).forEach((u) => URL.revokeObjectURL(u));
    minted.current = [];
    setMediaUrls({});
    setState(EMPTY);
    try { window.localStorage.removeItem(KEY); } catch { /* private mode */ }
    void mirror(async (c, uid) => {
      await Promise.all([
        c.from("likes").delete().eq("user_id", uid),
        c.from("saves").delete().eq("user_id", uid),
        c.from("posts").delete().eq("author_id", uid),
      ]);
    });
  }, [mediaUrls, mirror]);

  const clearPart = useCallback(async (part: "likes" | "saves" | "learned" | "posts") => {
    if (part === "posts") {
      await clearMedia();
      Object.values(mediaUrls).forEach((u) => URL.revokeObjectURL(u));
      setMediaUrls({});
      setState((s) => ({ ...s, posts: [] }));
      void mirror(async (c, uid) => { await c.from("posts").delete().eq("author_id", uid); });
      return;
    }
    if (part === "learned") { setState((s) => ({ ...s, learned: [], xp: 0 })); return; }
    setState((s) => ({ ...s, [part]: [] }));
    void mirror(async (c, uid) => {
      await c.from(part === "likes" ? "likes" : "saves").delete().eq("user_id", uid);
    });
  }, [mediaUrls, mirror]);

  const mediaUrlFor = useCallback<Ctx["mediaUrlFor"]>(
    (post) => post.remoteUrl ?? mediaUrls[post.id] ?? post.mediaUrl,
    [mediaUrls]
  );

  const value = useMemo<Ctx>(() => ({
    ...state,
    ready,
    live: isSupabaseConfigured,
    account,
    authBusy,
    signIn,
    signOut,
    isLiked: (id) => state.likes.includes(id),
    toggleLike,
    isSaved: (section, slug) => state.saves.some((x) => x.section === section && x.slug === slug),
    toggleSave,
    addPost,
    removePost,
    markLearned,
    hasLearned: (id) => state.learned.includes(id),
    mediaUrlFor,
    clearAll,
    clearPart,
  }), [state, ready, account, authBusy, signIn, signOut, toggleLike, toggleSave, addPost, removePost, markLearned, mediaUrlFor, clearAll, clearPart]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
