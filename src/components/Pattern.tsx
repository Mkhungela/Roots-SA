/**
 * Deterministic generative artwork.
 *
 * Every entry gets its own cover, derived from its slug, drawing on four South African
 * visual traditions: Ndebele wall painting (stepped outlined geometry), Zulu beadwork
 * (triangle registers), Basotho blanket emblems (banded repeats) and Xhosa beadwork
 * (concentric bands).
 *
 * Design rule learned the hard way: this is *texture*, not a poster. Earlier versions
 * rendered full-saturation five-colour motifs and then put card titles straight on top,
 * which made the main navigation unreadable. So every motif is now built from a single
 * hue per seed over a dark base, and anything with text on it must also use a scrim.
 *
 * Use `tone="vivid"` only for decorative areas that carry no text.
 */

/** One hue per seed. Saturation and lightness are fixed so nothing ever screams. */
const HUES = [12, 28, 45, 96, 150, 176, 212, 262, 316, 340];

type Tone = "muted" | "vivid";

function ramp(hue: number, tone: Tone) {
  const s = tone === "vivid" ? 72 : 46;
  return {
    base: `hsl(${hue} 28% 7%)`,
    deep: `hsl(${hue} ${s * 0.6}% 13%)`,
    mid: `hsl(${hue} ${s}% ${tone === "vivid" ? 42 : 24}%)`,
    high: `hsl(${hue} ${s}% ${tone === "vivid" ? 58 : 34}%)`,
    pale: `hsl(${hue} ${s * 0.5}% ${tone === "vivid" ? 74 : 46}%)`,
  };
}

/** Small, fast, stable string hash (FNV-1a). */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export type PatternProps = {
  seed: string;
  className?: string;
  /** 0 = barely there, 1 = full strength for this tone. */
  intensity?: number;
  tone?: Tone;
};

export function Pattern({ seed, className = "", intensity = 1, tone = "muted" }: PatternProps) {
  const h = hash(seed);
  const rand = rng(h);
  const hue = HUES[h % HUES.length];
  const { base, deep, mid, high, pale } = ramp(hue, tone);
  const motif = h % 5;
  const id = `p${h.toString(36)}`;
  const cells: React.ReactNode[] = [];

  cells.push(<rect key="bg" x={0} y={0} width={100} height={100} fill={base} />);

  if (motif === 0) {
    // Ndebele: stepped blocks, outlined.
    const n = 4;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const v = rand();
        const fill = v < 0.34 ? deep : v < 0.62 ? mid : v < 0.85 ? high : pale;
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={(c * 100) / n + 2} y={(r * 100) / n + 2}
            width={100 / n - 4} height={100 / n - 4}
            fill={fill} stroke={base} strokeWidth={1.4}
          />
        );
        if (v > 0.78) {
          const x = (c * 100) / n, y = (r * 100) / n, s = 100 / n;
          cells.push(
            <path key={`t-${r}-${c}`} d={`M${x + 4} ${y + s - 4}L${x + s / 2} ${y + 4}L${x + s - 4} ${y + s - 4}Z`}
              fill={pale} opacity={0.75} />
          );
        }
      }
    }
  } else if (motif === 1) {
    // Zulu beadwork: triangle register.
    const rows = 4, cols = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = rand();
        const x = (c * 100) / cols, y = (r * 100) / rows;
        const w = 100 / cols, hh = 100 / rows;
        cells.push(<rect key={`b-${r}-${c}`} x={x} y={y} width={w} height={hh} fill={v < 0.5 ? base : deep} />);
        const up = (r + c) % 2 === 0;
        cells.push(
          <path key={`z-${r}-${c}`}
            d={up ? `M${x} ${y + hh}L${x + w / 2} ${y}L${x + w} ${y + hh}Z` : `M${x} ${y}L${x + w} ${y}L${x + w / 2} ${y + hh}Z`}
            fill={v < 0.4 ? mid : v < 0.8 ? high : pale} opacity={0.9} />
        );
      }
    }
  } else if (motif === 2) {
    // Basotho blanket: banded repeats with an emblem row.
    const bands = 6;
    for (let i = 0; i < bands; i++) {
      const v = rand();
      cells.push(
        <rect key={`s-${i}`} x={0} y={(i * 100) / bands} width={100} height={100 / bands}
          fill={v < 0.3 ? deep : v < 0.6 ? mid : v < 0.85 ? high : base} />
      );
      if (v > 0.55) {
        for (let k = 0; k < 4; k++) {
          cells.push(
            <circle key={`e-${i}-${k}`} cx={12.5 + k * 25} cy={(i * 100) / bands + 100 / bands / 2}
              r={100 / bands / 4} fill={pale} opacity={0.6} />
          );
        }
      }
    }
  } else if (motif === 3) {
    // Xhosa: concentric bands from an off-centre point.
    const cx = 25 + rand() * 50, cy = 25 + rand() * 50;
    for (let i = 8; i >= 1; i--) {
      cells.push(
        <circle key={`c-${i}`} cx={cx} cy={cy} r={i * 10}
          fill={i % 3 === 0 ? mid : i % 3 === 1 ? deep : high} opacity={0.92} />
      );
    }
  } else {
    // Chevrons — the shweshwe register.
    const rows = 5;
    for (let r = 0; r < rows; r++) {
      const v = rand();
      const col = v < 0.4 ? mid : v < 0.75 ? high : pale;
      let d = "";
      for (let c = 0; c <= 6; c++) {
        const x = (c * 100) / 6, y = (r * 100) / rows + (c % 2 === 0 ? 0 : 100 / rows / 2);
        d += (c === 0 ? "M" : "L") + x + " " + y;
      }
      cells.push(<path key={`v-${r}`} d={d} fill="none" stroke={col} strokeWidth={100 / rows / 3} strokeLinecap="square" opacity={0.85} />);
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width="100" height="100" />
        </clipPath>
      </defs>
      {/*
        Intensity lives on the group, never as an inline style on the root <svg>.
        An inline root opacity outranks Tailwind `opacity-*` utilities, which silently
        forced every dimmed call site to full strength and made card text unreadable.
      */}
      <g clipPath={`url(#${id})`} opacity={Math.max(0, Math.min(1, intensity))}>{cells}</g>
    </svg>
  );
}

/** Two accent colours for a seed — used for glows, chips and gradients. */
export function seedColors(seed: string): [string, string] {
  const hue = HUES[hash(seed) % HUES.length];
  return [`hsl(${hue} 70% 56%)`, `hsl(${(hue + 38) % 360} 66% 48%)`];
}

/** The single accent hue for a seed, for borders and small marks. */
export function seedHue(seed: string): number {
  return HUES[hash(seed) % HUES.length];
}

export default Pattern;
