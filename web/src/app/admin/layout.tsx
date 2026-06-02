import { redirect } from "next/navigation";
import { FuzzNav } from "@/components/FuzzNav";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  return (
    <>
      <FuzzNav user={session} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
