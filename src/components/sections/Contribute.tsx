"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, Cloud, HardDrive, Mic, Pause,
  Play, Square, Trash2, Type, Upload, Video,
} from "lucide-react";
import { PROVINCE_LABEL, resolveRef } from "@/content";
import type { ProvinceCode, SectionId } from "@/lib/types";
import { useStore } from "@/lib/store";
import { clsx } from "@/components/ui";
import { Pattern } from "@/components/Pattern";

type Kind = "game" | "language" | "story" | "poetry" | "food" | "culture" | "place";
type Media = "audio" | "video" | "photo";

const KINDS: { id: Kind; emoji: string; label: string; prompt: string; section: SectionId }[] = [
  { id: "story", emoji: "👵🏾", label: "A story", prompt: "Who is telling it, and what is the memory?", section: "stories" },
  { id: "language", emoji: "🗣️", label: "A word or phrase", prompt: "Say the word, then say what it means.", section: "languages" },
  { id: "game", emoji: "🎮", label: "A game", prompt: "Show the setup, then the rules, then one round.", section: "games" },
  { id: "poetry", emoji: "🎤", label: "A poem", prompt: "Perform it. Don't read it like a shopping list.", section: "poetry" },
  { id: "food", emoji: "🍲", label: "A recipe", prompt: "Hands in the pot. Say the amounts out loud.", section: "food" },
  { id: "culture", emoji: "👗", label: "A tradition", prompt: "What is it, who does it, and what does it mean?", section: "culture" },
  { id: "place", emoji: "🗺️", label: "A place", prompt: "What happened here that is not on any plaque?", section: "map" },
];

const PROVINCES = Object.entries(PROVINCE_LABEL) as [ProvinceCode, string][];

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function Contribute() {
  const router = useRouter();
  const params = useSearchParams();
  const { addPost, live } = useStore();

  const paramKind = params.get("kind");
  const about = params.get("about");
  const challenge = params.get("challenge");

  const [kind, setKind] = useState<Kind>(
    (KINDS.find((k) => k.id === paramKind)?.id ?? "story") as Kind
  );
  const [step, setStep] = useState<1 | 2 | 3>(paramKind ? 2 : 1);
  const [media, setMedia] = useState<Media>("audio");

  // recording state
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [levels, setLevels] = useState<number[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const t0 = useRef(0);
  const previewVideo = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);

  // form
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [place, setPlace] = useState("");
  const [province, setProvince] = useState<ProvinceCode>("GP");
  const [caption, setCaption] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [consent, setConsent] = useState(false);
  const [done, setDone] = useState(false);

  const linked = about ? resolveRef(KINDS.find((k) => k.id === kind)!.section, about) : null;
  const challengeRef = challenge ? resolveRef("poetry", challenge) ?? resolveRef("games", challenge) : null;

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = async () => {
    setErr(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErr("Your browser will not let this page reach the microphone. You can still write it out below, or upload a file.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        media === "video" ? { audio: true, video: { facingMode: "user" } } : { audio: true }
      );
      streamRef.current = stream;
      if (media === "video" && previewVideo.current) {
        previewVideo.current.srcObject = stream;
        void previewVideo.current.play();
      }

      // live level meter
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteTimeDomainData(buf);
        let peak = 0;
        for (let i = 0; i < buf.length; i++) peak = Math.max(peak, Math.abs(buf[i] - 128) / 128);
        setLevels((l) => [...l.slice(-119), peak]);
        setElapsed(Date.now() - t0.current);
        rafRef.current = requestAnimationFrame(tick);
      };

      const mime = ["audio/webm;codecs=opus", "audio/webm", "video/webm;codecs=vp8,opus", "video/webm", "audio/mp4"]
        .find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
      rec.onstop = () => {
        const recorded = new Blob(chunks.current, { type: rec.mimeType });
        setBlob(recorded);
        setBlobUrl(URL.createObjectURL(recorded));
        void ctx.close();
        cleanup();
      };
      recRef.current = rec;
      t0.current = Date.now();
      setLevels([]);
      setElapsed(0);
      rec.start();
      setRecording(true);
      tick();
    } catch {
      setErr("Microphone permission was refused. Allow it in your browser, upload a file instead, or write the entry out below.");
    }
  };

  const stop = () => {
    recRef.current?.stop();
    setRecording(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const discard = () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setBlob(null);
    setElapsed(0);
    setLevels([]);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    setMedia(f.type.startsWith("video") ? "video" : f.type.startsWith("image") ? "photo" : "audio");
    setBlob(f);
    setBlobUrl(URL.createObjectURL(f));
    setErr(null);
  };

  const [saving, setSaving] = useState(false);

  const publish = async () => {
    setSaving(true);
    const k = KINDS.find((x) => x.id === kind)!;
    await addPost({
      blob,
      handle: handle.trim() ? (handle.startsWith("@") ? handle.trim() : `@${handle.trim()}`) : "@you",
      name: name.trim() || "Anonymous contributor",
      avatarSeed: handle || name || "you",
      place: place.trim() || "South Africa",
      province,
      caption: caption.trim() || k.label,
      body: body.trim() || undefined,
      kind,
      mediaKind: blobUrl ? media : "photo",
      duration: elapsed ? fmt(elapsed) : "—",
      tags: tags.split(/[,\s]+/).map((t) => t.replace(/^#/, "").trim()).filter(Boolean).slice(0, 6),
      link: linked ? { section: k.section, slug: about!, label: `See ${linked.title}` } : undefined,
    });
    setSaving(false);
    setDone(true);
  };

  const canPublish = consent && (!!blobUrl || body.trim().length > 20) && caption.trim().length > 2;

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <div className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-veld-500">
          <Check className="h-10 w-10 text-soil-950" strokeWidth={3} />
        </div>
        <h2 className="mt-6 font-display text-4xl text-soil-100">It is in the archive.</h2>
        <p className="mt-3 leading-relaxed text-soil-400">
          Your entry is at the top of the feed. You earned 50 XP — but more usefully, something
          that only existed in one house now exists in more than one place.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/feed" className="rounded-full bg-sun-500 px-6 py-3 font-bold text-soil-950 transition hover:bg-sun-400">
            See it in the feed
          </Link>
          <button
            onClick={() => { discard(); setDone(false); setStep(1); setCaption(""); setBody(""); setTags(""); }}
            className="rounded-full border border-soil-700 px-6 py-3 font-bold text-soil-200 transition hover:border-soil-500"
          >
            Add another
          </button>
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-soil-600">
          {live ? <Cloud className="h-3.5 w-3.5" /> : <HardDrive className="h-3.5 w-3.5" />}
          {live ? "Saved to the shared archive." : "Saved on this device only — connect Supabase to publish it to everyone."}
        </p>
      </div>
    );
  }

  const active = KINDS.find((k) => k.id === kind)!;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
      {/* steps */}
      <ol className="mb-8 flex items-center gap-2 text-xs font-bold">
        {[1, 2, 3].map((n) => (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span className={clsx("grid h-7 w-7 shrink-0 place-items-center rounded-full transition",
              step >= n ? "bg-veld-500 text-soil-950" : "bg-soil-800 text-soil-500")}>{n}</span>
            <span className={clsx("hidden sm:block", step >= n ? "text-soil-200" : "text-soil-600")}>
              {n === 1 ? "What is it" : n === 2 ? "Record it" : "Label it"}
            </span>
            {n < 3 && <span className={clsx("h-px flex-1", step > n ? "bg-veld-500" : "bg-soil-800")} />}
          </li>
        ))}
      </ol>

      {(linked || challengeRef) && (
        <div className="mb-6 flex items-center gap-3 rounded-card border border-soil-800 bg-soil-900 p-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
            <Pattern seed={about ?? challenge ?? "x"} className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-sun-500">
              {challengeRef ? "Entering a challenge" : "Adding to"}
            </p>
            <p className="truncate font-display text-lg text-soil-100">{(challengeRef ?? linked)!.title}</p>
          </div>
        </div>
      )}

      {/* step 1 */}
      {step === 1 && (
        <section className="animate-fade">
          <h2 className="font-display text-3xl text-soil-100">What are you adding?</h2>
          <p className="mt-2 text-soil-400">Pick one. You can add more later.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {KINDS.map((k) => (
              <button
                key={k.id}
                onClick={() => { setKind(k.id); setStep(2); }}
                className={clsx(
                  "group flex items-start gap-3.5 rounded-card border p-4 text-left transition",
                  kind === k.id ? "border-veld-500/60 bg-veld-500/10" : "border-soil-800 bg-soil-900 hover:-translate-y-0.5 hover:border-soil-600"
                )}
              >
                <span className="text-3xl">{k.emoji}</span>
                <span>
                  <span className="block font-display text-xl text-soil-100">{k.label}</span>
                  <span className="block text-sm leading-snug text-soil-400">{k.prompt}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* step 2 */}
      {step === 2 && (
        <section className="animate-fade">
          <button onClick={() => setStep(1)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> Change what it is
          </button>
          <h2 className="font-display text-3xl text-soil-100">{active.emoji} {active.label}</h2>
          <p className="mt-2 text-soil-400">{active.prompt}</p>

          <div className="mt-5 flex gap-2">
            {([["audio", Mic, "Audio"], ["video", Video, "Video"], ["photo", Type, "Text only"]] as const).map(([m, Icon, label]) => (
              <button
                key={m}
                onClick={() => { discard(); setMedia(m); }}
                className={clsx("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition",
                  media === m ? "border-soil-100 bg-soil-100 text-soil-950" : "border-soil-700 text-soil-300 hover:border-soil-500")}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-card border border-soil-800 bg-soil-900">
            {media === "video" && !blobUrl && (
              <video ref={previewVideo} muted playsInline className="aspect-video w-full bg-black object-cover" />
            )}

            {blobUrl ? (
              <div className="p-5">
                {media === "video" ? (
                  <video ref={playbackRef as React.RefObject<HTMLVideoElement>} src={blobUrl} controls playsInline className="aspect-video w-full rounded-xl bg-black" />
                ) : media === "photo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={blobUrl} alt="Your upload" className="max-h-72 w-full rounded-xl object-contain" />
                ) : (
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio
                      ref={playbackRef as React.RefObject<HTMLAudioElement>}
                      src={blobUrl}
                      onEnded={() => setPlaying(false)}
                    />
                    <button
                      onClick={() => {
                        const a = playbackRef.current; if (!a) return;
                        if (a.paused) { void a.play(); setPlaying(true); } else { a.pause(); setPlaying(false); }
                      }}
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-veld-500 text-soil-950"
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-0.5 h-6 w-6 fill-current" />}
                    </button>
                    <div className="flex h-12 flex-1 items-center gap-[2px]">
                      {(levels.length ? levels : Array.from({ length: 60 }, () => 0.4)).map((l, i) => (
                        <span key={i} className="flex-1 rounded-sm bg-veld-500/70" style={{ height: `${Math.max(l * 100, 6)}%` }} />
                      ))}
                    </div>
                    <span className="shrink-0 text-sm tabular-nums text-soil-400">{fmt(elapsed)}</span>
                  </div>
                )}
                <button onClick={discard} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-clay-500 hover:text-clay-400">
                  <Trash2 className="h-4 w-4" /> Discard and try again
                </button>
              </div>
            ) : media === "photo" ? (
              <label className="flex cursor-pointer flex-col items-center gap-3 p-10 text-center transition hover:bg-soil-850">
                <Upload className="h-7 w-7 text-soil-500" />
                <span className="font-semibold text-soil-200">Add a photo, or just write it out below</span>
                <span className="text-xs text-soil-500">An old family photograph counts. So does a typed memory.</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
            ) : (
              <div className="flex flex-col items-center gap-4 p-8">
                <div className="flex h-16 w-full max-w-md items-center justify-center gap-[2px]">
                  {(levels.length ? levels : Array.from({ length: 60 }, () => 0)).slice(-60).map((l, i) => (
                    <span
                      key={i}
                      className={clsx("flex-1 rounded-sm transition-[height] duration-75", recording ? "bg-clay-500" : "bg-soil-800")}
                      style={{ height: `${Math.max(l * 100, 4)}%` }}
                    />
                  ))}
                </div>
                <p className="font-display text-3xl tabular-nums text-soil-100">{fmt(elapsed)}</p>
                <button
                  onClick={recording ? stop : start}
                  className={clsx(
                    "grid h-20 w-20 place-items-center rounded-full transition active:scale-95",
                    recording ? "bg-clay-500 text-white" : "animate-pulse-ring bg-clay-500 text-white"
                  )}
                  aria-label={recording ? "Stop recording" : "Start recording"}
                >
                  {recording ? <Square className="h-7 w-7 fill-current" /> : media === "video" ? <Video className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <p className="text-sm text-soil-400">{recording ? "Recording — tap to stop" : `Tap to record ${media}`}</p>

                <label className="mt-2 cursor-pointer text-xs font-semibold text-soil-500 underline hover:text-soil-300">
                  or upload a file you already have
                  <input type="file" accept="audio/*,video/*,image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                </label>
              </div>
            )}
          </div>

          {err && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-clay-500/30 bg-clay-500/10 p-4 text-sm leading-relaxed text-soil-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay-500" /> {err}
            </div>
          )}

          <button
            onClick={() => setStep(3)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-veld-500 px-6 py-3 font-bold text-soil-950 transition hover:bg-veld-400"
          >
            Next: label it <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      )}

      {/* step 3 */}
      {step === 3 && (
        <section className="animate-fade">
          <button onClick={() => setStep(2)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-soil-400 hover:text-soil-100">
            <ArrowLeft className="h-4 w-4" /> Back to the recording
          </button>
          <h2 className="font-display text-3xl text-soil-100">Who, where, and what is it?</h2>
          <p className="mt-2 text-soil-400">
            This is the part that makes it findable in fifty years. Only the caption is required.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Your name" hint="Or your gogo's name, if this is hers">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nomsa Dlamini" className={inputCls} />
            </Field>
            <Field label="Handle">
              <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@nomsa" className={inputCls} />
            </Field>
            <Field label="Place" hint="Village, township, suburb">
              <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ga-Masemola" className={inputCls} />
            </Field>
            <Field label="Province">
              <select value={province} onChange={(e) => setProvince(e.target.value as ProvinceCode)} className={inputCls}>
                {PROVINCES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Caption" hint="One line. What is happening here?">
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="My gogo explains why we never point at the lake" className={inputCls} />
            </Field>
          </div>

          <div className="mt-4">
            <Field label={blobUrl ? "Anything else worth knowing" : "Write it out"} hint={blobUrl ? "Optional" : "Required if you did not record anything"}>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="Who taught you this? When? What did it mean in your house?"
                className={clsx(inputCls, "resize-y leading-relaxed")}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Tags" hint="Comma separated">
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tshivenda, water, gogo" className={inputCls} />
            </Field>
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-card border border-soil-800 bg-soil-900 p-4">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-veld-500" />
            <span className="text-sm leading-relaxed text-soil-300">
              The person in this recording agreed to it being added to a public archive, and
              I am not uploading anything that is secret, initiation-restricted, or not mine to share.
            </span>
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => void publish()}
              disabled={!canPublish || saving}
              className="inline-flex items-center gap-2 rounded-full bg-veld-500 px-7 py-3.5 font-bold text-soil-950 transition hover:bg-veld-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-5 w-5" /> {saving ? "Saving…" : "Add to the archive"}
            </button>
            <span className="flex items-center gap-1.5 text-xs text-soil-500">
              {live ? <Cloud className="h-3.5 w-3.5" /> : <HardDrive className="h-3.5 w-3.5" />}
              {live ? "Publishing to the shared archive" : "Stored on this device until Supabase is connected"}
            </span>
          </div>
          {!canPublish && (
            <p className="mt-3 text-xs text-soil-600">
              You still need {!caption.trim() && "a caption"}{!caption.trim() && (!blobUrl && body.trim().length <= 20) ? ", " : ""}
              {(!blobUrl && body.trim().length <= 20) && "a recording or a written entry"}
              {((!caption.trim() || (!blobUrl && body.trim().length <= 20)) && !consent) ? ", and " : ""}
              {!consent && "the consent tick"}.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-soil-700 bg-soil-900 px-4 py-3 text-soil-100 placeholder:text-soil-600 focus:border-veld-500 focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-soil-400">{label}</span>
        {hint && <span className="text-[11px] text-soil-600">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
