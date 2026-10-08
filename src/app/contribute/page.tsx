import type { Metadata } from "next";
import { Suspense } from "react";
import { Mic, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { Contribute } from "@/components/sections/Contribute";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Record a story, a word, a recipe, a game or a wedding tradition and add it to the archive. A phone and ninety seconds is enough.",
};

const POINTS = [
  { icon: Mic, title: "Ninety seconds is plenty", text: "You do not need a studio or a script. A phone in a kitchen is how most oral history actually gets recorded." },
  { icon: Users, title: "Record someone else", text: "The best entries are not you talking. They are your gogo, your uncle, the man who still carves. Hold the phone and ask one good question." },
  { icon: ShieldCheck, title: "Some things stay closed", text: "Initiation content, clan secrets and anything a family has not agreed to share do not belong in a public archive. Ask first." },
];

export default function ContributePage() {
  return (
    <div>
      <PageHeader
        emoji="📹"
        kicker="Contribute"
        accent="#4e9c4a"
        title="An archive that only reads is already dead."
        lead="Everything below was put here by someone. The gogo in Limpopo, the teenager in Soweto, the aunt whose chakalaka is the correct chakalaka — all of them are the archive. Add yours."
      />
      <Suspense fallback={<div className="mx-auto max-w-3xl px-5"><div className="h-96 animate-pulse rounded-card bg-soil-900" /></div>}>
        <Contribute />
      </Suspense>
      <div className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <div className="grid gap-3 border-t border-soil-800 pt-8 sm:grid-cols-3">
          {POINTS.map((p) => (
            <div key={p.title} className="rounded-card border border-soil-800 bg-soil-900 p-5">
              <p.icon className="h-5 w-5 text-veld-400" />
              <h3 className="mt-3 font-display text-lg leading-tight text-soil-100">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-soil-400">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
