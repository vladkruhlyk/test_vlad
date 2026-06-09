import Link from "next/link";

// Root fallback for unmatched, non-localized paths. Renders its own <html>
// because it can be shown outside the [locale] layout.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          color: "#0F172A",
          background: "#fff",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>404 — Page not found</h1>
        <Link href="/" style={{ color: "#2563EB" }}>
          Back to home
        </Link>
      </body>
    </html>
  );
}
