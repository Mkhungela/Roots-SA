import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { SavedBoard } from "@/components/sections/SavedBoard";

export const metadata: Metadata = {
  title: "Your archive",
  description: "Everything you saved, everything you learned, and everything you added to ROOTS SA.",
};

export default function SavedPage() {
  return (
    <div>
      <PageHeader
        emoji="🔖"
        kicker="Your archive"
        accent="#f5a623"
        title="What you kept."
        lead="Saved entries, the things you ticked off as learned, and the recordings you added yourself."
      />
      <Section><SavedBoard /></Section>
    </div>
  );
}
