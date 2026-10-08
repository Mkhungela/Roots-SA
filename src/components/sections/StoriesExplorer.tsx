"use client";

import { useState } from "react";
import { Clock, Headphones, MapPin } from "lucide-react";
import { STORIES, STORY_KINDS } from "@/content/stories";
import { PROVINCE_LABEL } from "@/content";
import { ArtCard, Chip, FilterRow, SeedBadge } from "@/components/ui";

export function StoriesExplorer() {
  const [kind, setKind] = useState<string>("all");
  const list = kind === "all" ? STORIES : STORIES.filter((s) => s.kind === kind);
  return (
    <>
      <FilterRow options={STORY_KINDS} value={kind} onChange={setKind} allLabel={`All ${STORIES.length}`} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <ArtCard
            key={s.slug}
            href={`/stories/${s.slug}`}
            seed={s.slug}
            tall
            eyebrow={<><Chip tone="clay">{STORY_KINDS.find((k) => k.id === s.kind)?.label}</Chip>{s.audio && <Chip tone="sun">🎧 Listen</Chip>}<SeedBadge synthetic={!!s.audio} /></>}
            title={s.title}
            subtitle={s.summary}
            footer={
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-soil-300">{s.teller}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{s.place}, {PROVINCE_LABEL[s.province]}</span>
                <span className="inline-flex items-center gap-1">{s.audio ? <Headphones className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{s.minutes} min</span>
              </span>
            }
          />
        ))}
      </div>
    </>
  );
}
