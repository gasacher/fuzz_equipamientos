import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import { FuzzDashboardNav } from "@/components/FuzzDashboardNav";
import type { SessionUser } from "@/lib/auth";

type Props = {
  user: SessionUser;
  catalogMode?: boolean;
};

export function FuzzNav({ user, catalogMode }: Props) {
  const isAdmin = user.role === "ADMIN";
  const maxW = catalogMode ? "max-w-7xl" : "max-w-6xl";

  if (isAdmin) {
    return (
      <FuzzDashboardNav
        hubHref="/admin"
        catalogHref="/admin/catalogo"
        publicSiteHref="/"
        userName={user.name}
        showLogout
      />
    );
  }

  return (
    <nav className="border-b border-white/10 bg-black">
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4 ${maxW}`}
      >
        <FuzzLogo size="bar" href="/" />
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-[#9c9c9c] sm:inline">{user.name}</span>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className="btn-fuzz-outline text-xs">
              Salir
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
