"use client";

import { useState } from "react";
import { POEMS, POEM_KINDS } from "@/content/poetry";
import { ArtCard, Chip, FilterRow } from "@/components/ui";

export function PoetryExplorer() {
  const [kind, setKind] = useState<string>("all");
  const list = kind === "all" ? POEMS : POEMS.filter((p) => p.kind === kind);
  return (
    <>
      <FilterRow options={POEM_KINDS} value={kind} onChange={setKind} allLabel={`All ${POEMS.length}`} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ArtCard
            key={p.slug}
            href={`/poetry/${p.slug}`}
            seed={p.slug}
            eyebrow={<><Chip tone={p.kind === "challenge" ? "sun" : "bead"}>{POEM_KINDS.find((k) => k.id === p.kind)?.label}</Chip>{p.audio && <Chip tone="sun">🎧 Listen</Chip>}</>}
            title={p.title}
            subtitle={p.about}
            footer={<span>{p.poet} · {p.language}</span>}
          />
        ))}
      </div>
    </>
  );
}
