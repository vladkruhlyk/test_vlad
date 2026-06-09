import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build an absolute URL from a path using the configured site URL. */
export function absoluteUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Safely parse a Json column that holds a string array. */
export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

/** Safely parse a Json column that holds {label,value} pairs. */
export function asKeyValueArray(value: unknown): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((v) => {
    if (v && typeof v === "object" && "label" in v && "value" in v) {
      const rec = v as Record<string, unknown>;
      return [{ label: String(rec.label), value: String(rec.value) }];
    }
    return [];
  });
}
