"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Trophy, X } from "lucide-react";
import { clsx } from "../ui";

/**
 * Playable Morabaraba (Twelve Men's Morris) against the computer.
 *
 * Board points, 0–23, three nested squares plus four diagonals:
 *
 *   0-----------1-----------2
 *   | \         |         / |
 *   |   3-------4-------5   |
 *   |   | \     |     / |   |
 *   |   |   6---7---8   |   |
 *   |   |   |       |   |   |
 *   9--10--11      12--13--14
 *   |   |   |       |   |   |
 *   |   |  15--16--17   |   |
 *   |   | /     |     \ |   |
 *   |  18------19------20   |
 *   | /         |         \ |
 *   21----------22---------23
 */

const ADJ: number[][] = [
  [1, 9, 3],            // 0
  [0, 2, 4],            // 1
  [1, 14, 5],           // 2
  [0, 4, 10, 6],        // 3
  [1, 3, 5, 7],         // 4
  [2, 4, 13, 8],        // 5
  [3, 7, 11],           // 6
  [4, 6, 8],            // 7
  [5, 7, 12],           // 8
  [0, 10, 21],          // 9
  [3, 9, 11, 18],       // 10
  [6, 10, 15],          // 11
  [8, 13, 17],          // 12
  [5, 12, 14, 20],      // 13
  [2, 13, 23],          // 14
  [11, 16, 18],         // 15
  [15, 17, 19],         // 16
  [12, 16, 20],         // 17
  [10, 15, 19, 21],     // 18
  [16, 18, 20, 22],     // 19
  [13, 17, 19, 23],     // 20
  [9, 18, 22],          // 21
  [19, 21, 23],         // 22
  [14, 20, 22],         // 23
];

const MILLS: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20], [21, 22, 23],
  [0, 9, 21], [3, 10, 18], [6, 11, 15], [1, 4, 7], [16, 19, 22], [8, 12, 17], [5, 13, 20], [2, 14, 23],
  [0, 3, 6], [2, 5, 8], [15, 18, 21], [17, 20, 23],
];

const MILLS_AT: number[][] = Array.from({ length: 24 }, (_, i) => MILLS.map((m, k) => (m.includes(i) ? k : -1)).filter((k) => k >= 0));

/** Pixel coordinates on a 100x100 viewBox. */
const XY: [number, number][] = [
  [6, 6], [50, 6], [94, 6],
  [22, 22], [50, 22], [78, 22],
  [38, 38], [50, 38], [62, 38],
  [6, 50], [22, 50], [38, 50], [62, 50], [78, 50], [94, 50],
  [38, 62], [50, 62], [62, 62],
  [22, 78], [50, 78], [78, 78],
  [6, 94], [50, 94], [94, 94],
];

const LINES: [number, number][] = [
  [0, 2], [21, 23], [0, 21], [2, 23],        // outer square
  [3, 5], [18, 20], [3, 18], [5, 20],        // middle square
  [6, 8], [15, 17], [6, 15], [8, 17],        // inner square
  [1, 7], [16, 22], [9, 11], [12, 14],       // cross spokes
  [0, 6], [2, 8], [15, 21], [17, 23],        // diagonals
];

type Cell = 0 | 1 | 2;          // 0 empty, 1 human, 2 computer
type Phase = "placing" | "moving" | "over";
type Board = Cell[];

const COWS = 12;

function millsFor(b: Board, p: Cell, at: number): boolean {
  return MILLS_AT[at].some((k) => MILLS[k].every((i) => b[i] === p));
}
function countMills(b: Board, p: Cell): number {
  return MILLS.reduce((n, m) => n + (m.every((i) => b[i] === p) ? 1 : 0), 0);
}
function pieces(b: Board, p: Cell): number[] {
  const out: number[] = [];
  for (let i = 0; i < 24; i++) if (b[i] === p) out.push(i);
  return out;
}
function canRemove(b: Board, victim: Cell, at: number): boolean {
  if (b[at] !== victim) return false;
  if (!millsFor(b, victim, at)) return true;
  // Only allowed when every one of their cows is inside a mill.
  return pieces(b, victim).every((i) => millsFor(b, victim, i));
}
function removable(b: Board, victim: Cell): number[] {
  return pieces(b, victim).filter((i) => canRemove(b, victim, i));
}
function mobility(b: Board, p: Cell, flying: boolean): number {
  if (flying) return b.filter((c) => c === 0).length * pieces(b, p).length;
  let n = 0;
  for (const i of pieces(b, p)) for (const j of ADJ[i]) if (b[j] === 0) n++;
  return n;
}

/* ------------------------------ AI ------------------------------------ */

type Move = { from: number | null; to: number; shoot: number | null };

function legalMoves(b: Board, p: Cell, placed: number, onBoard: number): Move[] {
  const out: Move[] = [];
  const opp: Cell = p === 1 ? 2 : 1;
  const push = (from: number | null, to: number) => {
    const nb = b.slice();
    if (from !== null) nb[from] = 0;
    nb[to] = p;
    if (millsFor(nb, p, to)) {
      const targets = removable(nb, opp);
      if (targets.length === 0) out.push({ from, to, shoot: null });
      else for (const s of targets) out.push({ from, to, shoot: s });
    } else out.push({ from, to, shoot: null });
  };

  if (placed < COWS) {
    for (let i = 0; i < 24; i++) if (b[i] === 0) push(null, i);
    return out;
  }
  const flying = onBoard === 3;
  for (const i of pieces(b, p)) {
    const dests = flying ? b.map((c, k) => (c === 0 ? k : -1)).filter((k) => k >= 0) : ADJ[i].filter((j) => b[j] === 0);
    for (const j of dests) push(i, j);
  }
  return out;
}

function apply(b: Board, p: Cell, m: Move): Board {
  const nb = b.slice();
  if (m.from !== null) nb[m.from] = 0;
  nb[m.to] = p;
  if (m.shoot !== null) nb[m.shoot] = 0;
  return nb;
}

function evaluate(b: Board, me: Cell, myPlaced: number, oppPlaced: number): number {
  const opp: Cell = me === 1 ? 2 : 1;
  const myOn = pieces(b, me).length;
  const opOn = pieces(b, opp).length;
  const myLeft = COWS - myPlaced;
  const opLeft = COWS - oppPlaced;
  if (myPlaced >= COWS && myOn <= 2) return -100000;
  if (oppPlaced >= COWS && opOn <= 2) return 100000;
  const material = (myOn + myLeft) - (opOn + opLeft);
  const mills = countMills(b, me) - countMills(b, opp);
  const mob = mobility(b, me, myOn === 3) - mobility(b, opp, opOn === 3);
  // Two-in-a-line with the third point open: the threat that wins games.
  let threat = 0;
  for (const m of MILLS) {
    const mine = m.filter((i) => b[i] === me).length;
    const theirs = m.filter((i) => b[i] === opp).length;
    const empty = m.filter((i) => b[i] === 0).length;
    if (mine === 2 && empty === 1) threat += 3;
    if (theirs === 2 && empty === 1) threat -= 3;
  }
  return material * 22 + mills * 9 + threat + mob * 0.4;
}

function minimax(
  b: Board, turn: Cell, me: Cell, depth: number, alpha: number, beta: number,
  placedBy: Record<Cell, number>
): number {
  const opp: Cell = me === 1 ? 2 : 1;
  const myOn = pieces(b, me).length;
  const opOn = pieces(b, opp).length;
  if (placedBy[me] >= COWS && myOn <= 2) return -100000 + (6 - depth);
  if (placedBy[opp] >= COWS && opOn <= 2) return 100000 - (6 - depth);
  if (depth === 0) return evaluate(b, me, placedBy[me], placedBy[opp]);

  const onBoard = pieces(b, turn).length;
  const moves = legalMoves(b, turn, placedBy[turn], onBoard);
  if (moves.length === 0) return turn === me ? -90000 + (6 - depth) : 90000 - (6 - depth);

  if (turn === me) {
    let best = -Infinity;
    for (const m of moves) {
      const np = { ...placedBy, [turn]: placedBy[turn] + (m.from === null ? 1 : 0) };
      best = Math.max(best, minimax(apply(b, turn, m), opp, me, depth - 1, alpha, beta, np));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const m of moves) {
    const np = { ...placedBy, [turn]: placedBy[turn] + (m.from === null ? 1 : 0) };
    best = Math.min(best, minimax(apply(b, turn, m), me, me, depth - 1, alpha, beta, np));
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

function chooseMove(b: Board, me: Cell, placedBy: Record<Cell, number>, level: "easy" | "medium" | "hard"): Move | null {
  const moves = legalMoves(b, me, placedBy[me], pieces(b, me).length);
  if (!moves.length) return null;
  if (level === "easy") {
    const shooters = moves.filter((m) => m.shoot !== null);
    const pool = shooters.length && Math.random() < 0.6 ? shooters : moves;
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const depth = level === "medium" ? 2 : 4;
  const opp: Cell = me === 1 ? 2 : 1;
  let best: Move | null = null;
  let bestScore = -Infinity;
  // Shuffle so equal-scoring games do not repeat move for move.
  const shuffled = moves.slice().sort(() => Math.random() - 0.5);
  for (const m of shuffled) {
    const np = { ...placedBy, [me]: placedBy[me] + (m.from === null ? 1 : 0) };
    const score = minimax(apply(b, me, m), opp, me, depth - 1, -Infinity, Infinity, np);
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
}

/* --------------------------- component -------------------------------- */

const EMPTY_BOARD: Board = Array(24).fill(0) as Board;

export function Morabaraba() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD);
  const [placed, setPlaced] = useState<Record<Cell, number>>({ 0: 0, 1: 0, 2: 0 } as Record<Cell, number>);
  const [turn, setTurn] = useState<Cell>(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [shootMode, setShootMode] = useState(false);
  const [level, setLevel] = useState<"easy" | "medium" | "hard">("medium");
  const [status, setStatus] = useState("Place your first cow.");
  const [over, setOver] = useState<null | "you" | "computer">(null);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const phase: Phase = over ? "over" : placed[1] >= COWS && placed[2] >= COWS ? "moving" : "placing";
  const myOn = useMemo(() => pieces(board, 1).length, [board]);
  const aiOn = useMemo(() => pieces(board, 2).length, [board]);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setBoard(EMPTY_BOARD);
    setPlaced({ 0: 0, 1: 0, 2: 0 } as Record<Cell, number>);
    setTurn(1); setSelected(null); setShootMode(false);
    setOver(null); setThinking(false); setLastMove(null);
    setStatus("Place your first cow.");
  }, []);

  const finish = useCallback((winner: "you" | "computer") => {
    setOver(winner);
    setStatus(winner === "you" ? "You win. Take the cattle." : "The computer took your herd.");
  }, []);

  /** After any board change, check whether the side to move has lost. */
  const checkEnd = useCallback((b: Board, next: Cell, p: Record<Cell, number>) => {
    const on = pieces(b, next).length;
    if (p[next] >= COWS && on <= 2) { finish(next === 1 ? "computer" : "you"); return true; }
    if (p[next] >= COWS && legalMoves(b, next, p[next], on).length === 0) { finish(next === 1 ? "computer" : "you"); return true; }
    return false;
  }, [finish]);

  /* ---- computer turn ---- */
  useEffect(() => {
    if (turn !== 2 || over) return;
    setThinking(true);
    timer.current = setTimeout(() => {
      const move = chooseMove(board, 2, placed, level);
      if (!move) { finish("you"); setThinking(false); return; }
      const nb = apply(board, 2, move);
      const np = { ...placed, 2: placed[2] + (move.from === null ? 1 : 0) };
      setBoard(nb); setPlaced(np); setLastMove(move.to); setThinking(false);
      setStatus(move.shoot !== null ? "The computer made a mill and shot one of your cows." : "Your turn.");
      if (!checkEnd(nb, 1, np)) setTurn(1);
    }, level === "hard" ? 420 : 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [turn, board, placed, level, over, checkEnd, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSelected((cur) => {
        if (cur === null) return cur;
        setStatus("Selection cleared. Pick a cow to move.");
        return null;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---- human interaction ---- */
  function onPoint(i: number) {
    if (over || turn !== 1 || thinking) return;

    if (shootMode) {
      if (!canRemove(board, 2, i)) {
        setStatus("You cannot shoot a cow that is inside a mill — unless all of them are.");
        return;
      }
      const nb = board.slice() as Board;
      nb[i] = 0;
      setBoard(nb); setShootMode(false);
      if (checkEnd(nb, 2, placed)) return;
      setTurn(2); setStatus("Computer is thinking…");
      return;
    }

    if (phase === "placing" && placed[1] < COWS) {
      if (board[i] !== 0) { setStatus("That point is taken."); return; }
      const nb = board.slice() as Board;
      nb[i] = 1;
      const np = { ...placed, 1: placed[1] + 1 };
      setBoard(nb); setPlaced(np); setLastMove(i);
      if (millsFor(nb, 1, i)) {
        const targets = removable(nb, 2);
        if (targets.length) { setShootMode(true); setStatus("Mill! Shoot one of the computer's cows."); return; }
      }
      if (checkEnd(nb, 2, np)) return;
      setTurn(2); setStatus("Computer is thinking…");
      return;
    }

    // moving phase
    const flying = myOn === 3;
    if (board[i] === 1) {
      if (selected === i) { setSelected(null); setStatus("Selection cleared. Pick a cow to move."); return; }
      const outs = flying ? board.some((c) => c === 0) : ADJ[i].some((j) => board[j] === 0);
      if (!outs) { setStatus("That cow is boxed in — every line from it is blocked. Pick another."); return; }
      setSelected(i);
      setStatus(flying ? "Flying — jump to any empty point. Tap it again to cancel." : "Slide to a connected empty point. Tap it again to cancel.");
      return;
    }
    if (selected !== null && board[i] === 0) {
      if (!flying && !ADJ[selected].includes(i)) { setStatus("Not connected. Follow the lines."); return; }
      const nb = board.slice() as Board;
      nb[selected] = 0; nb[i] = 1;
      setBoard(nb); setSelected(null); setLastMove(i);
      if (millsFor(nb, 1, i)) {
        const targets = removable(nb, 2);
        if (targets.length) { setShootMode(true); setStatus("Mill! Shoot one of the computer's cows."); return; }
      }
      if (checkEnd(nb, 2, placed)) return;
      setTurn(2); setStatus("Computer is thinking…");
    }
  }

  const shootable = shootMode ? new Set(removable(board, 2)) : new Set<number>();
  const targets = useMemo(() => {
    if (turn !== 1 || over || shootMode) return new Set<number>();
    if (phase === "placing") return new Set(board.map((c, i) => (c === 0 ? i : -1)).filter((i) => i >= 0));
    if (selected === null) return new Set<number>();
    const flying = myOn === 3;
    return new Set((flying ? board.map((c, i) => (c === 0 ? i : -1)).filter((i) => i >= 0) : ADJ[selected].filter((j) => board[j] === 0)));
  }, [board, selected, phase, turn, over, shootMode, myOn]);

  return (
    <div className="rounded-card border border-soil-800 bg-soil-900 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-soil-500">Difficulty</span>
          {(["easy", "medium", "hard"] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLevel(l); reset(); }}
              className={clsx("rounded-full px-3 py-1.5 text-xs font-bold capitalize transition",
                level === l ? "bg-sun-500 text-soil-950" : "bg-soil-800 text-soil-400 hover:text-soil-200")}
            >{l}</button>
          ))}
        </div>
        <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full border border-soil-700 px-3 py-1.5 text-xs font-bold text-soil-300 hover:border-soil-500 hover:text-soil-100">
          <RotateCcw className="h-3.5 w-3.5" /> New game
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_200px]">
        <div className="relative mx-auto w-full max-w-[460px]">
          <svg
            viewBox="-6 -6 112 112"
            className="w-full touch-manipulation select-none"
            onClick={(e) => { if (e.target === e.currentTarget && selected !== null) { setSelected(null); setStatus("Selection cleared. Pick a cow to move."); } }}
          >
            {LINES.map(([a, b], k) => (
              <line key={k} x1={XY[a][0]} y1={XY[a][1]} x2={XY[b][0]} y2={XY[b][1]}
                stroke="#4b3d38" strokeWidth={0.9} strokeLinecap="round" />
            ))}
            {XY.map(([x, y], i) => {
              const cell = board[i];
              const isTarget = targets.has(i);
              const isShoot = shootable.has(i);
              const isSel = selected === i;
              return (
                <g key={i} onClick={() => onPoint(i)} className="cursor-pointer" role="button" aria-label={`Point ${i + 1}`}>
                  <circle cx={x} cy={y} r={5.4} fill="transparent" />
                  {isTarget && <circle cx={x} cy={y} r={3.4} fill="#f5a623" opacity={0.28} className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px` }} />}
                  {cell === 0 ? (
                    <circle cx={x} cy={y} r={isTarget ? 2.6 : 1.5} fill={isTarget ? "#f5a623" : "#6b574f"} opacity={isTarget ? 0.9 : 0.75} />
                  ) : (
                    <>
                      <circle cx={x} cy={y} r={4.2}
                        fill={cell === 1 ? "#f5a623" : "#e04524"}
                        stroke={isSel ? "#f4ece7" : isShoot ? "#45c07a" : lastMove === i ? "#f4ece7" : "#0c0908"}
                        strokeWidth={isSel || isShoot ? 1.3 : 0.7}
                        opacity={isShoot ? 1 : 0.96}
                      />
                      {isShoot && <circle cx={x} cy={y} r={5.6} fill="none" stroke="#45c07a" strokeWidth={0.8} className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px` }} />}
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          <div className={clsx("rounded-2xl border p-3 text-sm font-semibold",
            over === "you" ? "border-veld-500/50 bg-veld-500/15 text-veld-400"
              : over === "computer" ? "border-clay-500/50 bg-clay-500/15 text-clay-400"
                : shootMode ? "border-veld-500/50 bg-veld-500/10 text-veld-400"
                  : "border-soil-700 bg-soil-850 text-soil-300")}>
            {over && <Trophy className="mb-1.5 h-4 w-4" />}
            {status}
            {selected !== null && (
              <button
                onClick={() => { setSelected(null); setStatus("Selection cleared. Pick a cow to move."); }}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-soil-600 bg-soil-900 px-3 py-2 text-xs font-bold text-soil-200 transition hover:border-sun-500 hover:text-sun-500"
              >
                <X className="h-3.5 w-3.5" /> Clear selection
                <span className="font-normal text-soil-500">(or press Esc)</span>
              </button>
            )}
          </div>

          <div className="space-y-2 rounded-2xl border border-soil-800 bg-soil-850 p-3 text-xs">
            <Row color="#f5a623" label="Your cows" onBoard={myOn} toPlace={COWS - placed[1]} />
            <Row color="#e04524" label="Computer" onBoard={aiOn} toPlace={COWS - placed[2]} />
            <div className="border-t border-soil-800 pt-2 text-soil-500">
              Phase: <span className="font-bold text-soil-300">{phase === "placing" ? "Placing cows" : phase === "moving" ? "Moving" : "Finished"}</span>
              {myOn === 3 && phase === "moving" && !over && <span className="ml-2 text-sun-500">You can fly</span>}
            </div>
          </div>

          <p className="text-xs leading-relaxed text-soil-500">
            Three in a line along a drawn line is a mill — shoot one enemy cow. You cannot shoot a
            cow inside a mill unless every one of theirs is in a mill. Down to three cows, you fly.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ color, label, onBoard, toPlace }: { color: string; label: string; onBoard: number; toPlace: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: color }} />
      <span className="flex-1 font-semibold text-soil-200">{label}</span>
      <span className="tabular-nums text-soil-400">{onBoard} on board</span>
      {toPlace > 0 && <span className="tabular-nums text-soil-600">· {toPlace} to place</span>}
    </div>
  );
}

export default Morabaraba;
