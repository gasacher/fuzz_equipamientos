"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FuzzLogo } from "@/components/FuzzLogo";

type Props = {
  hubHref: string;
  homeHref?: string;
  catalogHref?: string;
  publicSiteHref?: string;
  userName?: string;
  showLogout?: boolean;
  demo?: boolean;
};

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function FuzzDashboardNav({
  hubHref,
  homeHref,
  catalogHref,
  publicSiteHref,
  userName,
  showLogout,
  demo,
}: Props) {
  const pathname = usePathname();
  const isHub = normalizePath(pathname) === normalizePath(hubHref);

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <FuzzLogo size="bar" href={hubHref} />

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
          {!isHub ? (
            <Link
              href={hubHref}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#333] bg-[#111] px-3 py-1.5 text-[#f2f2f2] transition hover:border-[#e50914] hover:text-white"
            >
              ← Dashboard
            </Link>
          ) : (
            <>
              {catalogHref && (
                <Link href={catalogHref} className="text-[#9c9c9c] hover:text-white">
                  Catálogo web
                </Link>
              )}
              {homeHref && (
                <Link href={homeHref} className="text-[#9c9c9c] hover:text-white">
                  Inicio
                </Link>
              )}
              {publicSiteHref && (
                <a
                  href={publicSiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#9c9c9c] hover:text-white"
                >
                  Ver sitio público
                </a>
              )}
            </>
          )}

          {userName && <span className="hidden text-[#9c9c9c] sm:inline">{userName}</span>}

          {showLogout ? (
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="btn-fuzz-outline text-xs">
                Salir
              </button>
            </form>
          ) : demo ? (
            <span className="btn-fuzz-outline pointer-events-none text-xs opacity-70">Salir</span>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
