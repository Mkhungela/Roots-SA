"use client";

import { useState } from "react";
import { CULTURE, CULTURE_KINDS } from "@/content/culture";
import { PROVINCE_LABEL } from "@/content";
import { ArtCard, Chip, FilterRow } from "@/components/ui";

export function CultureExplorer() {
  const [kind, setKind] = useState<string>("all");
  const list = kind === "all" ? CULTURE : CULTURE.filter((c) => c.kind === kind);
  return (
    <>
      <FilterRow options={CULTURE_KINDS} value={kind} onChange={setKind} allLabel={`All ${CULTURE.length}`} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <ArtCard
            key={c.slug}
            href={`/culture/${c.slug}`}
            seed={c.slug}
            eyebrow={<><Chip tone="ink">{CULTURE_KINDS.find((k) => k.id === c.kind)?.emoji} {CULTURE_KINDS.find((k) => k.id === c.kind)?.label}</Chip></>}
            title={c.name}
            subtitle={c.oneLine}
            footer={<span>{c.people} · {PROVINCE_LABEL[c.province]}</span>}
          />
        ))}
      </div>
    </>
  );
}
