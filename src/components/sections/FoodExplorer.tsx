"use client";

import { useState } from "react";
import { Flame, Users } from "lucide-react";
import { RECIPES, RECIPE_KINDS } from "@/content/food";
import { PROVINCE_LABEL } from "@/content";
import { ArtCard, Chip, FilterRow } from "@/components/ui";

export function FoodExplorer() {
  const [kind, setKind] = useState<string>("all");
  const list = kind === "all" ? RECIPES : RECIPES.filter((r) => r.kind === kind);
  return (
    <>
      <FilterRow options={RECIPE_KINDS} value={kind} onChange={setKind} allLabel={`All ${RECIPES.length}`} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <ArtCard
            key={r.slug}
            href={`/food/${r.slug}`}
            seed={r.slug}
            eyebrow={<><Chip tone="veld">{RECIPE_KINDS.find((k) => k.id === r.kind)?.label}</Chip><Chip>{PROVINCE_LABEL[r.province]}</Chip></>}
            title={r.name}
            subtitle={r.story.split(". ")[0] + "."}
            footer={
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3" />{r.time}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{r.serves}</span>
                {r.aka[0] && <span className="italic">aka {r.aka[0]}</span>}
              </span>
            }
          />
        ))}
      </div>
    </>
  );
}
