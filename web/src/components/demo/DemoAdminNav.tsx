import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import { appPath } from "@/lib/site-path";
import { panelDemoPath } from "@/lib/panel-demo-path";

export function DemoAdminNav() {
  const panel = panelDemoPath();
  const catalog = appPath("/");

  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <FuzzLogo size="bar" href={panel} />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href={panel} className="text-[#f2f2f2] hover:text-white">
            Panel
          </Link>
          <Link href={panelDemoPath("/inventario")} className="text-[#f2f2f2] hover:text-white">
            Stock
          </Link>
          <Link href={panelDemoPath("/ventas")} className="text-[#f2f2f2] hover:text-white">
            Ventas
          </Link>
          <Link href={panelDemoPath("/catalogo")} className="text-[#f2f2f2] hover:text-white">
            Catálogo web
          </Link>
          <a href={catalog} target="_blank" rel="noreferrer" className="text-[#f2f2f2] hover:text-white">
            Ver sitio público
          </a>
          <span className="hidden text-[#9c9c9c] sm:inline">Admin FUZZ</span>
          <span className="btn-fuzz-outline pointer-events-none text-xs opacity-70">Salir</span>
        </div>
      </div>
    </nav>
  );
}
