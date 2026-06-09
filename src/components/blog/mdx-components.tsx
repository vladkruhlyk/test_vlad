import type { MDXComponents } from "mdx/types";
import NextLink from "next/link";
import { slugifyHeading } from "@/lib/mdx";

function headingText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => {
    const id = slugifyHeading(headingText(children));
    return (
      <h2 id={id} className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = slugifyHeading(headingText(children));
    return (
      <h3 id={id} className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight">
        {children}
      </h3>
    );
  },
  p: ({ children }) => <p className="mt-5 leading-relaxed text-muted-foreground">{children}</p>,
  ul: ({ children }) => <ul className="mt-5 space-y-2 pl-5 [&>li]:list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 space-y-2 pl-5 [&>li]:list-decimal">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed text-muted-foreground">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  a: ({ href, children }) => (
    <NextLink href={href ?? "#"} className="font-medium text-accent underline-offset-4 hover:underline">
      {children}
    </NextLink>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-accent pl-4 italic text-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm">{children}</code>
  ),
};
