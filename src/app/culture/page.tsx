import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { CultureExplorer } from "@/components/sections/CultureExplorer";

export const metadata: Metadata = {
  title: "Culture",
  description:
    "Clothing, ceremonies, marriage traditions, music, dance, crafts and traditional homes — what they mean and who they belong to.",
};

export default function CulturePage() {
  return (
    <div>
      <PageHeader
        emoji="👗"
        kicker="Culture"
        accent="#6f5bd6"
        title="Every garment is a sentence. Most people only see the photograph."
        lead="An isicholo tells you a woman is married. Ndebele wall painting was a language under a government that was not reading. Here is what the clothes, ceremonies, music and houses are actually saying."
      />
      <Section><CultureExplorer /></Section>
    </div>
  );
}
