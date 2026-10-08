import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: {
    default: "ROOTS SA — a living archive of South African culture",
    template: "%s · ROOTS SA",
  },
  description:
    "Indigenous games, languages, gogo stories, izibongo, food, ceremony and a heritage map of South Africa — built so that young people can learn it and elders can record it.",
  keywords: [
    "South Africa", "heritage", "indigenous games", "isiZulu", "isiXhosa", "izibongo",
    "oral history", "diketo", "morabaraba", "umngqusho", "ubuntu", "Mzansi",
  ],
  openGraph: {
    title: "ROOTS SA — a living archive of South African culture",
    description: "Learn a game. Learn a word. Listen to a gogo. Record your own.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0908",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <body className="antialiased">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
