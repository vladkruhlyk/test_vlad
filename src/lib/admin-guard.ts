import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

/** Server-side guard for admin pages. Redirects to login if not an admin/editor. */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/admin/login");
  }
  return session;
}
