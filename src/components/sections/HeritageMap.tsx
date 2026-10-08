"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, Plus, Quote, Search, Users, X, Maximize2, MapPin } from "lucide-react";
import { MAP_VIEWBOX, PROVINCE_SHAPES, projectLatLng } from "@/content/za-map";
import { PLACES, PLACE_KINDS } from "@/content/heritage";
import { PROVINCE_LABEL } from "@/content";
import type { HeritagePlace } from "@/lib/types";
import { clsx, Chip, SaveButton, SeedBadge } from "@/components/ui";
import { Pattern } from "@/components/Pattern";

const KIND_COLOR: Record<string, string> = Object.fromEntries(PLACE_KINDS.map((k) => [k.id, k.color]));

const PINS = PLACES.map((p) => ({ ...p, ...projectLatLng(p.lat, p.lng) }));

export function HeritageMap() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("place");
  const place = active ? PLACES.find((p) => p.slug === active) ?? null : null;

  const [kind, setKind] = useState<string>("all");
  const [q, setQ] = useState("");
  const [hover, setHover] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PINS.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (!needle) return true;
      return (
        p.name.toLowerCase().includes(needle) ||
        (p.alsoKnown ?? "").toLowerCase().includes(needle) ||
        p.whatHappened.toLowerCase().includes(needle) ||
        PROVINCE_LABEL[p.province].toLowerCase().includes(needle)
      );
    });
  }, [kind, q]);

  const select = useCallback(
    (slug: string | null) => {
      router.replace(slug ? `/map?place=${slug}` : "/map", { scroll: false });
    },
    [router]
  );

  // Centre the viewport on a place when it is opened from a deep link.
  useEffect(() => {
    if (!place) return;
    const { x, y } = projectLatLng(place.lat, place.lng);
    setZoom((z) => Math.max(z, 2.4));
    setPan({
      x: MAP_VIEWBOX.x + MAP_VIEWBOX.w / 2 - x,
      y: MAP_VIEWBOX.y + MAP_VIEWBOX.h / 2 - y,
    });
  }, [place]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && place) select(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [place, select]);

  // A little headroom so a hovered pin label at the very top is not clipped.
  const PAD = 420;
  const vb = useMemo(() => {
    const w = (MAP_VIEWBOX.w + PAD * 2) / zoom;
    const h = (MAP_VIEWBOX.h + PAD * 2) / zoom;
    const cx = MAP_VIEWBOX.x + MAP_VIEWBOX.w / 2 - pan.x;
    const cy = MAP_VIEWBOX.y + MAP_VIEWBOX.h / 2 - pan.y;
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }, [zoom, pan]);

  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = MAP_VIEWBOX.w / zoom / rect.width;
    setPan({
      x: drag.current.px + (e.clientX - drag.current.x) * scale,
      y: drag.current.py + (e.clientY - drag.current.y) * scale,
    });
  };
  const onPointerUp = () => { drag.current = null; };

  const pinScale = 1 / Math.sqrt(zoom);

  return (
    <div className="relative">
      {/* controls */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
          <button
            onClick={() => setKind("all")}
            className={clsx("shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition",
              kind === "all" ? "border-soil-100 bg-soil-100 text-soil-950" : "border-soil-700 text-soil-400 hover:border-soil-500")}
          >All {PLACES.length}</button>
          {PLACE_KINDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKind(kind === k.id ? "all" : k.id)}
              className={clsx("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition",
                kind === k.id ? "text-soil-950" : "border-soil-700 text-soil-400 hover:border-soil-500")}
              style={kind === k.id ? { background: k.color, borderColor: k.color } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: kind === k.id ? "rgba(0,0,0,.45)" : k.color }} />
              {k.label}
            </button>
          ))}
        </div>
        <div className="relative lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-soil-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search places…"
            className="w-full rounded-full border border-soil-700 bg-soil-900 py-2 pl-9 pr-3 text-sm text-soil-100 placeholder:text-soil-600 focus:border-sun-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* map */}
        <div className="relative overflow-hidden rounded-card border border-soil-800 bg-[#0a0f14]">
          <svg
            ref={svgRef}
            viewBox={vb}
            className="h-[52vh] w-full touch-none select-none sm:h-[66vh]"
            style={{ cursor: drag.current ? "grabbing" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            role="img"
            aria-label="Map of South African heritage places"
          >
            <defs>
              <radialGradient id="sea" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stopColor="#102029" />
                <stop offset="100%" stopColor="#070b0e" />
              </radialGradient>
              <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="40" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x={MAP_VIEWBOX.x - 4000} y={MAP_VIEWBOX.y - 4000} width={MAP_VIEWBOX.w + 8000} height={MAP_VIEWBOX.h + 8000} fill="url(#sea)" />

            {/* provinces */}
            <g>
              {PROVINCE_SHAPES.map((s) => (
                <path
                  key={s.code}
                  d={s.d}
                  fill={hover === s.code ? "#2a211d" : "#1d1714"}
                  stroke="#4a3b34"
                  strokeWidth={10 / zoom}
                  strokeLinejoin="round"
                  onMouseEnter={() => setHover(s.code)}
                  onMouseLeave={() => setHover(null)}
                  className="transition-[fill] duration-200"
                />
              ))}
            </g>

            {/* province labels */}
            {zoom < 2.6 && (
              <g className="pointer-events-none">
                {PROVINCE_SHAPES.map((s) => (
                  <text
                    key={s.code}
                    x={s.label[0]}
                    y={s.label[1]}
                    textAnchor="middle"
                    fill="#6b5a51"
                    fontSize={210 / Math.sqrt(zoom)}
                    fontWeight={700}
                    letterSpacing={18 / Math.sqrt(zoom)}
                  >
                    {s.code}
                  </text>
                ))}
              </g>
            )}

            {/* pins */}
            <g>
              {visible.map((p) => {
                const on = place?.slug === p.slug;
                const c = KIND_COLOR[p.kind] ?? "#f5a623";
                const r = (on ? 115 : 78) * pinScale;
                return (
                  <g
                    key={p.slug}
                    transform={`translate(${p.x} ${p.y})`}
                    className="cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); select(on ? null : p.slug); }}
                    onMouseEnter={() => setHover(p.slug)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {on && <circle r={r * 2.4} fill={c} opacity={0.18} filter="url(#glow)" />}
                    <circle r={r * 1.9} fill={c} opacity={hover === p.slug || on ? 0.25 : 0} />
                    <circle r={r} fill={c} stroke="#0a0f14" strokeWidth={r * 0.28} />
                    {(hover === p.slug || on || zoom > 2.2) && (
                      <text
                        y={-r - 50 * pinScale}
                        textAnchor="middle"
                        fill="#f2e9e4"
                        fontSize={200 * pinScale}
                        fontWeight={700}
                        stroke="#0a0f14"
                        strokeWidth={48 * pinScale}
                        paintOrder="stroke"
                        className="pointer-events-none"
                      >
                        {p.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* zoom controls */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button onClick={() => setZoom((z) => Math.min(z * 1.5, 9))} aria-label="Zoom in"
              className="grid h-9 w-9 place-items-center rounded-xl border border-soil-700 bg-soil-900/90 text-soil-200 backdrop-blur transition hover:border-soil-500">
              <Plus className="h-4 w-4" />
            </button>
            <button onClick={() => setZoom((z) => Math.max(z / 1.5, 1))} aria-label="Zoom out"
              className="grid h-9 w-9 place-items-center rounded-xl border border-soil-700 bg-soil-900/90 text-soil-200 backdrop-blur transition hover:border-soil-500">
              <Minus className="h-4 w-4" />
            </button>
            <button onClick={reset} aria-label="Reset view"
              className="grid h-9 w-9 place-items-center rounded-xl border border-soil-700 bg-soil-900/90 text-soil-200 backdrop-blur transition hover:border-soil-500">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-soil-950/70 px-2.5 py-1.5 text-[11px] text-soil-500 backdrop-blur">
            {visible.length} place{visible.length === 1 ? "" : "s"} · drag to pan
          </div>
        </div>

        {/* list */}
        <div className="thin-scrollbar max-h-[66vh] space-y-2 overflow-y-auto pr-1">
          {visible.map((p) => (
            <button
              key={p.slug}
              onClick={() => select(p.slug)}
              className={clsx(
                "flex w-full gap-3 rounded-2xl border p-3 text-left transition",
                place?.slug === p.slug ? "border-sun-500/60 bg-sun-500/10" : "border-soil-800 bg-soil-900 hover:border-soil-600"
              )}
            >
              <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: KIND_COLOR[p.kind] }} />
              <span className="min-w-0">
                <span className="block font-display text-lg leading-tight text-soil-100">{p.name}</span>
                <span className="block text-xs text-soil-500">{PROVINCE_LABEL[p.province]} · {p.era}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-snug text-soil-400">{p.whatHappened}</span>
              </span>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-soil-700 p-6 text-center text-sm text-soil-500">
              Nothing matches “{q}”.
            </p>
          )}
        </div>
      </div>

      {place && <PlaceSheet place={place} onClose={() => select(null)} />}
    </div>
  );
}

/* ---------------------------- detail sheet ---------------------------- */

function PlaceSheet({ place, onClose }: { place: HeritagePlace; onClose: () => void }) {
  const color = KIND_COLOR[place.kind] ?? "#f5a623";
  const kindLabel = PLACE_KINDS.find((k) => k.id === place.kind)?.label;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-4" role="dialog" aria-modal="true" aria-label={place.name}>
      <button className="absolute inset-0 bg-soil-950/70 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="animate-rise relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl border border-soil-800 bg-soil-950 sm:max-w-lg sm:rounded-3xl">
        <div className="relative shrink-0 overflow-hidden">
          <Pattern seed={place.slug} className="h-32 w-full opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-soil-950 via-soil-950/60 to-transparent" />
          <button onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-soil-950/70 text-soil-200 backdrop-blur transition hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-5 right-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-soil-950" style={{ background: color }}>{kindLabel}</span>
              <Chip>{place.era}</Chip>
            </div>
          </div>
        </div>

        <div className="thin-scrollbar overflow-y-auto px-5 pb-8 pt-4">
          <h2 className="font-display text-3xl leading-tight text-soil-100">{place.name}</h2>
          {place.alsoKnown && <p className="mt-0.5 text-sm text-soil-500">{place.alsoKnown}</p>}
          <p className="mt-1 flex items-center gap-1.5 text-xs text-soil-500">
            <MapPin className="h-3 w-3" /> {PROVINCE_LABEL[place.province]} · {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
          </p>

          <p className="mt-4 text-pretty text-lg leading-relaxed text-soil-200">{place.whatHappened}</p>

          <div className="mt-4"><SaveButton section="map" slug={place.slug} label /></div>

          <div className="mt-6 space-y-4">
            {place.detail.map((d, i) => (
              <p key={i} className="leading-relaxed text-soil-300">{d}</p>
            ))}
          </div>

          {place.nameMeaning && (
            <div className="mt-6 rounded-2xl border border-soil-800 bg-soil-900 p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-sun-500">What the name means</p>
              <p className="mt-1.5 leading-relaxed text-soil-300">{place.nameMeaning}</p>
            </div>
          )}

          {place.status && (
            <div className="mt-3 rounded-2xl border border-soil-800 bg-soil-900 p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-soil-500">Status today</p>
              <p className="mt-1.5 leading-relaxed text-soil-300">{place.status}</p>
            </div>
          )}

          {place.people.length > 0 && (
            <section className="mt-6">
              <h3 className="mb-2.5 flex items-center gap-2 font-display text-xl text-soil-100">
                <Users className="h-4 w-4 text-soil-500" /> People of this place
              </h3>
              <ul className="space-y-2">
                {place.people.map((p) => (
                  <li key={p.name} className="rounded-2xl border border-soil-800 bg-soil-900 p-3.5">
                    <p className="font-semibold text-soil-100">{p.name}</p>
                    <p className="mt-0.5 text-sm leading-snug text-soil-400">{p.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {place.communityVoices.length > 0 && (
            <section className="mt-6">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <h3 className="font-display text-xl text-soil-100">Community voices</h3>
                <SeedBadge />
              </div>
              <ul className="space-y-2">
                {place.communityVoices.map((v, i) => (
                  <li key={i} className="rounded-2xl border-l-2 bg-soil-900 p-4" style={{ borderLeftColor: color }}>
                    <Quote className="h-4 w-4" style={{ color }} />
                    <p className="mt-1.5 leading-relaxed text-soil-200">{v.text}</p>
                    <p className="mt-2 text-xs font-semibold text-soil-500">— {v.who}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link
            href={`/contribute?kind=heritage&about=${place.slug}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-sun-500 px-5 py-3 text-sm font-bold text-soil-950 transition hover:bg-sun-400"
          >
            Add a memory of this place
          </Link>
        </div>
      </div>
    </div>
  );
}
