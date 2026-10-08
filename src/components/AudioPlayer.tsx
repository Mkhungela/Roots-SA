"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Info, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { clsx } from "./ui";

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

function waveFor(src: string, n = 64) {
  return Array.from({ length: n }, (_, i) => {
    let h = 2166136261;
    const s = src + i;
    for (let k = 0; k < s.length; k++) { h ^= s.charCodeAt(k); h = Math.imul(h, 16777619); }
    return 0.22 + ((h >>> 0) % 1000) / 1000 * 0.78;
  });
}

/**
 * Audio player for recorded stories and izibongo.
 * `src` may be several files; they are played back to back as one recording.
 */
export function AudioPlayer({
  src, title, subtitle, accent = "#f5a623", synthetic = false,
}: {
  src: string | string[];
  title: string;
  subtitle?: string;
  accent?: string;
  /** Flags a machine-read sample entry rather than a real field recording. */
  synthetic?: boolean;
}) {
  const parts = useMemo(() => (Array.isArray(src) ? src : [src]), [src]);
  const ref = useRef<HTMLAudioElement>(null);
  const [part, setPart] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [rate, setRate] = useState(1);
  const [failed, setFailed] = useState(false);
  const autoplayNext = useRef(false);

  const bars = useMemo(() => waveFor(parts[part] ?? ""), [parts, part]);

  const onEnded = useCallback(() => {
    if (part < parts.length - 1) {
      autoplayNext.current = true;
      setPart((p) => p + 1);
    } else {
      setPlaying(false);
      setPart(0);
      setT(0);
    }
  }, [part, parts.length]);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onMeta = () => {
      setDur(a.duration);
      if (autoplayNext.current) {
        autoplayNext.current = false;
        void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    const onErr = () => setFailed(true);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onErr);
    };
  }, [onEnded]);

  useEffect(() => { if (ref.current) ref.current.playbackRate = rate; }, [rate, part]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else void a.play().then(() => setPlaying(true)).catch(() => setFailed(true));
  };

  const seekTo = (frac: number) => {
    const a = ref.current;
    if (!a || !isFinite(a.duration)) return;
    a.currentTime = a.duration * Math.min(Math.max(frac, 0), 0.999);
    setT(a.currentTime);
  };

  const restart = () => {
    autoplayNext.current = playing;
    if (part !== 0) setPart(0); else seekTo(0);
  };

  const progress = dur ? t / dur : 0;

  return (
    <div className="rounded-card border border-soil-800 bg-soil-900 p-4 sm:p-5">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={ref} src={parts[part]} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-soil-950 transition active:scale-95"
          style={{ background: accent }}
        >
          {playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-0.5 h-6 w-6 fill-current" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 shrink-0 text-soil-500" />
            <p className="truncate text-sm font-bold text-soil-100">{title}</p>
            {parts.length > 1 && (
              <span className="shrink-0 rounded-full bg-soil-800 px-2 py-0.5 text-[10px] font-bold tabular-nums text-soil-400">
                {part + 1}/{parts.length}
              </span>
            )}
          </div>
          {subtitle && <p className="truncate text-xs text-soil-500">{subtitle}</p>}

          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seekTo(progress + 0.05);
              if (e.key === "ArrowLeft") seekTo(progress - 0.05);
            }}
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seekTo((e.clientX - r.left) / r.width);
            }}
            className="mt-2.5 flex h-10 w-full cursor-pointer items-end gap-[2px]"
          >
            {bars.map((h, i) => {
              const on = i / bars.length <= progress;
              return (
                <span
                  key={i}
                  className="flex-1 rounded-sm transition-colors"
                  style={{ height: `${h * 100}%`, background: on ? accent : "#352b28" }}
                />
              );
            })}
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] tabular-nums text-soil-500">
            <span>{fmt(t)}</span>
            <div className="flex items-center gap-1.5">
              {[1, 1.25, 1.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={clsx("rounded px-1.5 py-0.5 font-semibold transition", rate === r ? "bg-soil-700 text-soil-100" : "hover:text-soil-300")}
                >{r}×</button>
              ))}
              <button onClick={restart} aria-label="Restart" className="ml-1 hover:text-soil-300"><RotateCcw className="h-3.5 w-3.5" /></button>
            </div>
            <span>{fmt(dur)}</span>
          </div>
        </div>
      </div>

      {synthetic && (
        <p className="mt-3 flex items-start gap-2 border-t border-soil-800 pt-3 text-[11px] leading-relaxed text-soil-600">
          <Info className="mt-px h-3.5 w-3.5 shrink-0" />
          A machine-read version of this sample entry, so you can hear the shape of it. It is not a
          recording of a real person — that is the part the archive is still waiting for.
        </p>
      )}

      {failed && <p className="mt-3 text-xs text-clay-400">This recording could not be loaded in your browser.</p>}
    </div>
  );
}
