"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { clsx } from "../ui";

/**
 * Diketo, as a two-tap timing game.
 *
 * Throw the mother stone, SCOOP while it is in the air, then CATCH it before it lands.
 * Round n asks you to scoop n stones, and the airtime shortens as you go — which is
 * exactly how the real game escalates. Any miss sends you back to round one, which is
 * also exactly how the real game works.
 */

const ROUNDS = 10;

type Stage = "idle" | "flying" | "scooped" | "won" | "lost";

/** Airtime in ms for a given round — gets tighter as you climb. */
const airtime = (round: number) => Math.max(820, 1600 - round * 70);
/** Scoop window, as a fraction of the flight. */
const SCOOP = [0.18, 0.62] as const;
/** Catch window — the last slice of the flight. */
const CATCH = [0.78, 1.0] as const;

export function Diketo() {
  const [round, setRound] = useState(1);
  const [stage, setStage] = useState<Stage>("idle");
  const [t, setT] = useState(0);               // 0..1 progress through the flight
  const [msg, setMsg] = useState("Throw the mother stone to begin.");
  const [best, setBest] = useState(0);
  const [inHole, setInHole] = useState(10);
  const [grabbed, setGrabbed] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const scoopedAt = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  const fail = useCallback((why: string) => {
    stop();
    setStage("lost");
    setMsg(why);
    setBest((b) => Math.max(b, round - 1));
  }, [round, stop]);

  const throwStone = useCallback(() => {
    if (stage === "flying" || stage === "scooped") return;
    if (stage === "lost" || stage === "won") { setRound(1); setInHole(10); }
    scoopedAt.current = null;
    setGrabbed(0);
    setStage("flying");
    setMsg("Scoop!");
    start.current = performance.now();
    const dur = airtime(stage === "lost" || stage === "won" ? 1 : round);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / dur);
      setT(p);
      if (p >= 1) {
        if (scoopedAt.current === null) fail("The stone landed and the hole is untouched. Back to round one.");
        else fail("You scooped but you did not catch it. Back to round one.");
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [stage, round, fail]);

  const act = useCallback(() => {
    if (stage === "idle" || stage === "lost" || stage === "won") { throwStone(); return; }
    const p = t;
    if (stage === "flying") {
      if (p < SCOOP[0]) { fail("Too early — the stone has barely left your hand."); return; }
      if (p > SCOOP[1]) { fail("Too late to scoop. The stone is already coming down."); return; }
      scoopedAt.current = p;
      const take = Math.min(round, inHole);
      setGrabbed(take);
      setStage("scooped");
      setMsg("Now catch it!");
      return;
    }
    if (stage === "scooped") {
      if (p < CATCH[0]) { fail("You snatched at it. Let the stone come down to you."); return; }
      stop();
      const left = inHole - grabbed;
      setInHole(left);
      if (round >= ROUNDS) {
        setStage("won");
        setBest(ROUNDS);
        setMsg("All ten rounds. That is a clean game — go and tell your gogo.");
        return;
      }
      setRound((r) => r + 1);
      setStage("idle");
      setMsg(left <= 0 ? `Hole empty — refill and take ${round + 1} next time.` : `Caught. Now scoop ${round + 1}.`);
      if (left <= 0) setInHole(10);
    }
  }, [stage, t, round, inHole, grabbed, throwStone, fail, stop]);

  // Space / Enter to play.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); act(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [act]);

  const reset = () => { stop(); setRound(1); setStage("idle"); setT(0); setInHole(10); setGrabbed(0); setMsg("Throw the mother stone to begin."); };

  const flying = stage === "flying" || stage === "scooped";
  // Parabola: height peaks at t = 0.5.
  const height = flying ? 4 * t * (1 - t) : 0;
  const stoneY = 76 - height * 62;
  const stoneX = 50 + (flying ? Math.sin(t * Math.PI) * 4 : 0);

  const inScoop = t >= SCOOP[0] && t <= SCOOP[1];
  const inCatch = t >= CATCH[0];

  return (
    <div className="rounded-card border border-soil-800 bg-soil-900 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-soil-500">Round</div>
            <div className="font-display text-2xl text-soil-100">{Math.min(round, ROUNDS)}<span className="text-base text-soil-600">/{ROUNDS}</span></div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-soil-500">Best</div>
            <div className="font-display text-2xl text-sun-500">{best}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-soil-500">In the hole</div>
            <div className="font-display text-2xl text-soil-300">{inHole}</div>
          </div>
        </div>
        <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-soil-700 px-3 py-1.5 text-xs font-bold text-soil-300 hover:border-soil-500 hover:text-soil-100">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-soil-800 bg-gradient-to-b from-soil-850 to-soil-900">
        <svg viewBox="0 0 100 96" className="w-full select-none" style={{ maxHeight: 340 }}>
          {/* ground */}
          <ellipse cx="50" cy="86" rx="46" ry="8" fill="#241d1b" />
          {/* hole */}
          <ellipse cx="50" cy="80" rx="15" ry="5.5" fill="#0c0908" />
          <ellipse cx="50" cy="79" rx="15" ry="5.5" fill="#1b1615" />
          {/* stones in the hole */}
          {Array.from({ length: Math.min(inHole, 10) }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            return <circle key={i} cx={50 + Math.cos(a) * (3 + (i % 3) * 2.6)} cy={79 + Math.sin(a) * 1.8} r={1.5} fill="#9b8278" />;
          })}
          {/* scooped stones travelling to the hand */}
          {stage === "scooped" && Array.from({ length: grabbed }).map((_, i) => (
            <circle key={i} cx={22 + i * 2.6} cy={74} r={1.5} fill="#ffc24d" className="animate-pop" />
          ))}
          {/* timing track */}
          <rect x="12" y="8" width="76" height="4" rx="2" fill="#241d1b" />
          <rect x={12 + 76 * SCOOP[0]} y="8" width={76 * (SCOOP[1] - SCOOP[0])} height="4" rx="2" fill="#22a35c" opacity="0.6" />
          <rect x={12 + 76 * CATCH[0]} y="8" width={76 * (CATCH[1] - CATCH[0])} height="4" rx="2" fill="#f5a623" opacity="0.7" />
          {flying && <rect x={12 + 76 * t - 0.6} y="5.5" width="1.6" height="9" rx="0.8" fill="#f4ece7" />}
          <text x="12" y="5" fontSize="3.4" fill="#6b574f" fontWeight="700">SCOOP ZONE</text>
          <text x={12 + 76 * CATCH[0]} y="5" fontSize="3.4" fill="#6b574f" fontWeight="700">CATCH</text>
          {/* mother stone */}
          <g>
            <ellipse cx={stoneX} cy={82} rx={5 - height * 2.6} ry={1.6 - height * 0.8} fill="#0c0908" opacity={0.45} />
            <circle cx={stoneX} cy={stoneY} r="5" fill="#e04524" />
            <circle cx={stoneX - 1.6} cy={stoneY - 1.6} r="1.5" fill="#f0674a" opacity="0.8" />
          </g>
        </svg>

        {/* status overlay */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          {stage === "won" && <span className="animate-pop rounded-full bg-veld-500 px-4 py-2 text-sm font-bold text-soil-950">Clean game 🎉</span>}
          {stage === "lost" && <span className="animate-pop rounded-full bg-clay-500 px-4 py-2 text-sm font-bold text-soil-100">Out</span>}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          onClick={act}
          className={clsx(
            "flex-1 rounded-2xl px-6 py-4 font-display text-lg font-bold transition active:scale-[0.98]",
            stage === "idle" || stage === "lost" || stage === "won"
              ? "bg-clay-500 text-soil-100 hover:bg-clay-400"
              : stage === "flying"
                ? clsx("text-soil-950", inScoop ? "bg-veld-500 hover:bg-veld-400" : "bg-soil-700 text-soil-300")
                : clsx("text-soil-950", inCatch ? "bg-sun-500 hover:bg-sun-400" : "bg-soil-700 text-soil-300")
          )}
        >
          {stage === "flying" ? `Scoop ${Math.min(round, inHole)}` : stage === "scooped" ? "Catch!" : stage === "won" ? "Play again" : stage === "lost" ? "Throw again" : "Throw"}
        </button>
        <div className={clsx("flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold",
          stage === "won" ? "border-veld-500/50 bg-veld-500/15 text-veld-400"
            : stage === "lost" ? "border-clay-500/50 bg-clay-500/15 text-clay-400"
              : "border-soil-700 bg-soil-850 text-soil-300")}>
          {stage === "won" && <Trophy className="mb-1 h-4 w-4" />}
          {msg}
        </div>
      </div>
      <p className="mt-3 text-xs text-soil-600">Tap the button, or use the space bar. Green band = scoop. Gold band = catch.</p>
    </div>
  );
}

export default Diketo;
