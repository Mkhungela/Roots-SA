import type { Metadata } from "next";
import { Suspense } from "react";
import { Feed } from "@/components/sections/Feed";

export const metadata: Metadata = {
  title: "Feed",
  description: "Short vertical posts from across South Africa — games, words, gogo stories, izibongo, cooking and ceremonies. Like, comment, save, share.",
};

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="h-[100dvh] w-full bg-black" />}>
      <Feed />
    </Suspense>
  );
}
