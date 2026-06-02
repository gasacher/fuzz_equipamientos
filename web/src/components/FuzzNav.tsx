import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import type { SessionUser } from "@/lib/auth";

type Props = {
  user: SessionUser;
  catalogMode?: boolean;
};

export function FuzzNav({ user, catalogMode }: Props) {
  const isAdmin = user.role === "ADMIN";

  return (
    <nav className="border-b border-white/10 bg-black">
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4 ${catalogMode ? "max-w-7xl" : "max-w-6xl"}`}
      >
        <FuzzLogo size="bar" href={isAdmin ? "/admin" : "/"} />
        <div className="flex items-center gap-3 text-sm">
          {isAdmin && (
            <>
              <Link href="/admin" className="text-[#f2f2f2] hover:text-white">
                Panel
              </Link>
              <Link href="/admin/inventario" className="text-[#f2f2f2] hover:text-white">
                Stock
              </Link>
              <Link href="/admin/ventas" className="text-[#f2f2f2] hover:text-white">
                Ventas
              </Link>
              <Link href="/admin/catalogo" className="text-[#f2f2f2] hover:text-white">
                Catálogo web
              </Link>
              <a href="/" target="_blank" rel="noreferrer" className="text-[#f2f2f2] hover:text-white">
                Ver sitio público
              </a>
            </>
          )}
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
