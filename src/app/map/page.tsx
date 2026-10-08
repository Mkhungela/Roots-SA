import type { Metadata } from "next";
import { Suspense } from "react";
import { PLACES } from "@/content/heritage";
import { PageHeader, Section } from "@/components/ui";
import { HeritageMap } from "@/components/sections/HeritageMap";

export const metadata: Metadata = {
  title: "Heritage Map",
  description:
    "Tap a place on the map of South Africa and find out what happened there — Mapungubwe, District Six, Vilakazi Street, Isandlwana, Lake Fundudzi and more.",
};

export default function MapPage() {
  return (
    <div>
      <PageHeader
        emoji="🗺️"
        kicker="Heritage Map"
        accent="#2fc4d6"
        title="Everywhere is somewhere something happened."
        lead={`${PLACES.length} places across all nine provinces — kingdoms, massacres, removals, sacred water, a prison, a street with two Nobel laureates. Tap one.`}
      />
      <Section>
        <Suspense fallback={<div className="h-[66vh] animate-pulse rounded-card border border-soil-800 bg-soil-900" />}>
          <HeritageMap />
        </Suspense>
      </Section>
    </div>
  );
}
