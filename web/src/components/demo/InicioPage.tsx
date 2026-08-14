import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";
import { FuzzSiteFooter } from "@/components/FuzzSiteFooter";
import { appPath } from "@/lib/site-path";
import { panelDemoPath } from "@/lib/panel-demo-path";

export function InicioPage() {
  const catalogo = appPath("/catalogo");
  const panel = panelDemoPath();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="border-b border-white/10 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <FuzzLogo size="login" href={appPath("/")} />
          <h1 className="fuzz-title mt-6 text-3xl text-white md:text-4xl">FUZZ Equipamientos</h1>
          <p className="mt-3 max-w-lg text-sm text-[#9c9c9c] md:text-base">
            Catálogo para clientes y panel de gestión interna.
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-4 py-10 md:gap-6">
        <Link
          href={catalogo}
          className="group block rounded-xl border border-[#1c1c1c] bg-[#111] p-6 transition hover:border-[#e50914] md:p-8"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">
            Para clientes
          </span>
          <h2 className="fuzz-title mt-3 text-2xl text-white md:text-3xl">Catálogo web</h2>
          <p className="mt-2 text-sm text-[#9c9c9c]">
            Instrumentos en venta, precios en USD, consulta por WhatsApp y visita al showroom.
          </p>
          <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
            Ver catálogo →
          </p>
        </Link>

        <Link
          href={appPath("/showroom")}
          className="group block rounded-xl border border-[#1c1c1c] bg-[#111] p-6 transition hover:border-[#e50914] md:p-8"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">
            Showroom
          </span>
          <h2 className="fuzz-title mt-3 text-2xl text-white md:text-3xl">Agendar visita</h2>
          <p className="mt-2 text-sm text-[#9c9c9c]">
            Calendario lun–vie 11 a 19 h. El cliente elige día y horario; el panel confirma o
            cancela.
          </p>
          <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
            Probar agenda →
          </p>
        </Link>

        <Link
          href={panel}
          className="group block rounded-xl border border-[#1c1c1c] bg-[#111] p-6 transition hover:border-[#e50914] md:p-8"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">
            Gestión interna
          </span>
          <h2 className="fuzz-title mt-3 text-2xl text-white md:text-3xl">Dashboard FUZZ</h2>
          <p className="mt-2 text-sm text-[#9c9c9c]">
            Clientes y contratos · inventario con trazabilidad · control de pendientes · ventas ·
            citas al showroom.
          </p>
          <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
            Abrir panel →
          </p>
        </Link>
      </main>

      <FuzzSiteFooter note="Vista de presentación" />
    </div>
  );
}
