import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { FoodExplorer } from "@/components/sections/FoodExplorer";

export const metadata: Metadata = {
  title: "Food",
  description:
    "Traditional South African recipes with the story behind each dish — umngqusho, chakalaka, bunny chow, amagwinya, umqombothi, potjiekos and more.",
};

export default function FoodPage() {
  return (
    <div>
      <PageHeader
        emoji="🍲"
        kicker="Food"
        accent="#4e9c4a"
        title="Nobody writes these down. That is exactly the problem."
        lead="Every one of these is measured in handfuls and 'until it looks right'. We have written them down anyway — with the story of where the dish came from, because that is the part that actually gets lost."
      />
      <Section><FoodExplorer /></Section>
    </div>
  );
}
