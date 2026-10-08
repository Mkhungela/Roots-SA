"use client";

import { useMemo, useState } from "react";
import { Gamepad2, Users } from "lucide-react";
import { GAMES } from "@/content/games";
import { PROVINCE_LABEL } from "@/content";
import { ArtCard, Chip, FilterRow } from "@/components/ui";

const TAGS = [
  { id: "playable", label: "Playable here", emoji: "🕹️" },
  { id: "strategy", label: "Strategy", emoji: "♟️" },
  { id: "running", label: "Running", emoji: "🏃🏾" },
  { id: "no equipment", label: "No equipment", emoji: "✋🏾" },
  { id: "storytelling", label: "Storytelling", emoji: "🗣️" },
  { id: "team", label: "Team", emoji: "👥" },
];

export function GamesExplorer() {
  const [filter, setFilter] = useState<string>("all");

  const games = useMemo(() => {
    if (filter === "all") return GAMES;
    if (filter === "playable") return GAMES.filter((g) => g.playable);
    return GAMES.filter((g) => g.tags.includes(filter));
  }, [filter]);

  return (
    <>
      <FilterRow options={TAGS} value={filter} onChange={setFilter} allLabel={`All ${GAMES.length}`} />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <ArtCard
            key={g.slug}
            href={`/games/${g.slug}`}
            seed={g.slug}
            eyebrow={g.playable ? <Chip tone="veld"><Gamepad2 className="h-3 w-3" /> Playable</Chip> : <Chip>{g.provinces.map((p) => PROVINCE_LABEL[p]).join(" · ")}</Chip>}
            title={g.name}
            subtitle={g.tagline}
            footer={
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{g.players}</span>
                <span>· {g.aka.length} other names</span>
              </span>
            }
          />
        ))}
      </div>
      {games.length === 0 && (
        <p className="py-16 text-center text-soil-500">Nothing with that filter yet.</p>
      )}
    </>
  );
}
