"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-ZA">
      <body style={{ background: "#0c0908", color: "#f2e9e4", fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, padding: "2rem", textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>ROOTS SA could not start.</h1>
          <p style={{ color: "#9b8778", maxWidth: 420, lineHeight: 1.6 }}>
            Something failed at the very top of the app. Reloading usually fixes it.
          </p>
          {error.digest && <p style={{ fontFamily: "monospace", fontSize: 12, color: "#6b5a51" }}>ref {error.digest}</p>}
          <button onClick={reset} style={{ marginTop: 16, background: "#f5a623", color: "#0c0908", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
