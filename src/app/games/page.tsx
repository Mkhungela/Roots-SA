import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { GamesExplorer } from "@/components/sections/GamesExplorer";

export const metadata: Metadata = {
  title: "Indigenous Games",
  description:
    "Diketo, morabaraba, kgati, dibeke, masekitlana and more — how to play, regional variations, challenges, and two you can play right now in the browser.",
};

export default function GamesPage() {
  return (
    <div>
      <PageHeader
        emoji="🎮"
        kicker="Indigenous Games"
        accent="#f5a623"
        title="Games that needed nothing but ground and a handful of stones."
        lead="Learn the rules, see how they change from province to province, take the challenge — and play two of them right here. No console, no console-shaped excuse."
      />
      <Section>
        <GamesExplorer />
      </Section>
    </div>
  );
}
