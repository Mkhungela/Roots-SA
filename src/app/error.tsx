"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="mx-auto grid min-h-[70vh] w-full max-w-xl place-items-center px-5 text-center">
      <div>
        <AlertTriangle className="mx-auto h-10 w-10 text-clay-500" />
        <h1 className="mt-5 font-display text-3xl text-soil-100 sm:text-4xl">That page fell over.</h1>
        <p className="mt-3 leading-relaxed text-soil-400">
          Something went wrong rendering this part of the archive. Nothing you saved has been lost —
          it is all still in your browser.
        </p>
        {error.digest && <p className="mt-2 font-mono text-xs text-soil-600">ref {error.digest}</p>}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-sun-500 px-5 py-3 font-bold text-soil-950 transition hover:bg-sun-400">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <Link href="/" className="rounded-full border border-soil-700 px-5 py-3 font-bold text-soil-200 transition hover:border-soil-500">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
