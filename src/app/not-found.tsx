import Link from "next/link";
import { Compass } from "lucide-react";
import { SECTIONS } from "@/content";
import { Pattern } from "@/components/Pattern";

export default function NotFound() {
  return (
    <div className="relative mx-auto grid min-h-[70vh] w-full max-w-3xl place-items-center px-5 py-16 text-center sm:px-8">
      <Pattern seed="not-found" className="absolute inset-0 h-full w-full opacity-10" />
      <div className="relative">
        <Compass className="mx-auto h-10 w-10 text-soil-600" />
        <p className="mt-6 font-display text-7xl leading-none text-soil-800">404</p>
        <h1 className="mt-3 font-display text-3xl text-soil-100 sm:text-4xl">
          Nothing is archived at this address.
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-soil-400">
          The link may be old, or the entry may never have existed. Try one of the eight
          sections, or search with <kbd className="rounded bg-soil-800 px-1.5 py-0.5 text-xs font-bold text-soil-200">⌘K</kbd>.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SECTIONS.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="rounded-full border border-soil-700 px-4 py-2 text-sm font-semibold text-soil-200 transition hover:border-soil-500 hover:text-soil-100"
            >
              {s.emoji} {s.label}
            </Link>
          ))}
        </div>
        <Link href="/" className="mt-8 inline-block rounded-full bg-sun-500 px-6 py-3 font-bold text-soil-950 transition hover:bg-sun-400">
          Back to the start
        </Link>
      </div>
    </div>
  );
}
