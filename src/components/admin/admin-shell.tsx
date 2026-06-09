import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Link2,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "./sign-out-button";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/affiliate-links", label: "Affiliate links", icon: Link2 },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminShell({
  children,
  title,
  user,
}: {
  children: React.ReactNode;
  title: string;
  user?: { name?: string | null; email?: string | null };
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo href="/admin" localized={false} />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          {user && (
            <div className="mb-2 px-3 py-2">
              <p className="truncate text-sm font-medium">{user.name ?? "Admin"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            View site →
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
