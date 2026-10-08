import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { StoriesExplorer } from "@/components/sections/StoriesExplorer";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Gogo stories, mkhulu stories, childhood memories, village and township history, and how people used to live — recorded oral history from across South Africa.",
};

export default function StoriesPage() {
  return (
    <div>
      <PageHeader
        emoji="👵🏾"
        kicker="Stories"
        accent="#e04524"
        title="The things that were never written down."
        lead="Oral history exists because most of what happened to most South Africans never made it into a book. These are the memories, the removals, the villages, the kitchens and the long walks to the river."
      />
      <Section><StoriesExplorer /></Section>
    </div>
  );
}
