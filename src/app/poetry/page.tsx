import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui";
import { PoetryExplorer } from "@/components/sections/PoetryExplorer";

export const metadata: Metadata = {
  title: "Poetry",
  description:
    "Izibongo, dithoko, riddles and spoken word — South African praise poetry from the imbongi tradition to the open mic, with challenges you can enter.",
};

export default function PoetryPage() {
  return (
    <div>
      <PageHeader
        emoji="🎤"
        kicker="Poetry"
        accent="#ec3b80"
        title="The imbongi could tell a king he was wrong. That licence never left."
        lead="Izibongo is not flattery — it is a performed history with permission to criticise. Here is where it came from, where it went, and two challenges to write your own."
      />
      <Section><PoetryExplorer /></Section>
    </div>
  );
}
