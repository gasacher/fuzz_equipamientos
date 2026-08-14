import Link from "next/link";

type Props = {
  pathPrefix: string;
  stats: {
    clients: number;
    instruments: number;
    pendingTotal: number;
    pendingCritical: number;
    salesCount?: number;
    appointmentsPending?: number;
    traceabilityReady: boolean;
  };
  catalogHref?: string;
  showroomHref?: string;
};

const sections = [
  {
    key: "clientes",
    label: "Perfiles",
    title: "Clientes",
    desc: "Número de cliente, teléfono, contratos e instrumentos vinculados.",
    icon: "◉",
    accent: "from-[#7ec8e3]/20 to-transparent",
    border: "border-[#7ec8e3]/40",
    stat: (s: Props["stats"]) => `${s.clients}`,
    statLabel: "clientes activos",
    href: (p: string) => `${p}/clientes`,
  },
  {
    key: "inventario",
    label: "Trazabilidad",
    title: "Inventario",
    desc: "Estados, ubicación, ventas, comprador, recibo e historial con fechas.",
    icon: "◎",
    accent: "from-[#6fcf97]/20 to-transparent",
    border: "border-[#6fcf97]/40",
    stat: (s: Props["stats"]) => `${s.instruments}`,
    statLabel: "productos en stock",
    href: (p: string) => `${p}/inventario`,
  },
  {
    key: "pendientes",
    label: "Control interno",
    title: "Pendientes",
    desc: "Borradores, tags y alertas según demoras de foto, precio o publicación.",
    icon: "⚑",
    accent: "from-[#ffb020]/20 to-transparent",
    border: "border-[#ffb020]/40",
    stat: (s: Props["stats"]) => `${s.pendingTotal}`,
    statLabel: "en cola",
    extra: (s: Props["stats"]) =>
      s.pendingCritical > 0 ? `${s.pendingCritical} críticos` : null,
    href: (p: string) => `${p}/pendientes`,
  },
  {
    key: "ventas",
    label: "Ventas",
    title: "Operaciones",
    desc: "Registro de ventas, comisiones y totales del Excel.",
    icon: "◈",
    accent: "from-[#e50914]/20 to-transparent",
    border: "border-[#e50914]/40",
    stat: (s: Props["stats"]) => `${s.salesCount ?? 0}`,
    statLabel: "ventas registradas",
    href: (p: string) => `${p}/ventas`,
  },
  {
    key: "citas",
    label: "Showroom",
    title: "Citas",
    desc: "Visitas agendadas al local (lun–vie 11–19 h). Confirmá o cancelá desde acá.",
    icon: "◷",
    accent: "from-[#a0a0ff]/20 to-transparent",
    border: "border-[#a0a0ff]/40",
    stat: (s: Props["stats"]) => `${s.appointmentsPending ?? 0}`,
    statLabel: "pendientes de confirmar",
    href: (p: string) => `${p}/citas`,
  },
] as const;

export function DashboardPillars({ pathPrefix, stats, catalogHref, showroomHref }: Props) {
  const visibleSections = sections;

  return (
    <div className="space-y-8">
      <div
        className={`grid grid-cols-2 gap-3 ${visibleSections.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}
      >
        {visibleSections.map((sec) => (
          <div
            key={sec.key}
            className={`rounded-xl border bg-[#0f0f0f] p-4 ${sec.border}`}
          >
            <p className="text-3xl font-bold tabular-nums text-white">{sec.stat(stats)}</p>
            <p className="mt-1 text-xs text-[#9c9c9c]">{sec.statLabel}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSections.map((sec) => {
          const extra = "extra" in sec && sec.extra ? sec.extra(stats) : null;
          return (
            <Link
              key={sec.key}
              href={sec.href(pathPrefix)}
              className={`group relative overflow-hidden rounded-2xl border border-[#1c1c1c] bg-[#111] p-6 transition hover:border-[#e50914] hover:shadow-[0_0_40px_-12px_rgba(229,9,20,0.35)]`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${sec.accent} opacity-80`}
              />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-xl text-[#e50914]"
                    aria-hidden
                  >
                    {sec.icon}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">
                    {sec.label}
                  </span>
                </div>
                <h2 className="fuzz-title mt-4 text-2xl text-white">{sec.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#9c9c9c]">{sec.desc}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold tabular-nums text-white">
                    {sec.stat(stats)}
                  </span>
                  {extra && (
                    <span className="rounded-full border border-[#e50914]/40 bg-[#1a0a0a] px-2.5 py-0.5 text-xs text-[#e50914]">
                      {extra}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm font-medium text-[#f2f2f2] group-hover:text-[#e50914]">
                  Entrar →
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {catalogHref && (
        <p className="text-center text-sm text-[#9c9c9c]">
          Vista pública del catálogo:{" "}
          <Link href={catalogHref} className="text-[#e50914] hover:underline">
            ver cómo lo ven los clientes
          </Link>
          {showroomHref && (
            <>
              {" "}
              ·{" "}
              <Link href={showroomHref} className="text-[#e50914] hover:underline">
                agendar visita al showroom
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}
