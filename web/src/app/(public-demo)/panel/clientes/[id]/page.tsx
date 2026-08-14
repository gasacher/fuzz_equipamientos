import Link from "next/link";
import { notFound } from "next/navigation";
import { InstrumentTable } from "@/components/InstrumentTable";
import {
  demoClientStaticParams,
  formatDemoDate,
  getDemoClient,
} from "@/lib/demo-features";
import { panelDemoPath } from "@/lib/panel-demo-path";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoClientStaticParams();
}

export default async function DemoClientePerfilPage({ params }: Props) {
  const { id } = await params;
  const client = getDemoClient(id);
  if (!client) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href={panelDemoPath("/clientes")} className="text-sm text-[#9c9c9c] hover:text-white">
          ← Clientes
        </Link>
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <h1 className="fuzz-title text-3xl">{client.name}</h1>
          <span className="rounded border border-[#e50914]/40 bg-[#1a0a0a] px-3 py-1 font-mono text-sm text-[#e50914]">
            {client.clientNumber}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="fuzz-card space-y-3 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">Datos</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-[#9c9c9c]">Teléfono</dt>
              <dd className="text-white">{client.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[#9c9c9c]">Email</dt>
              <dd className="text-white">{client.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[#9c9c9c]">Notas internas</dt>
              <dd className="text-[#f2f2f2]">{client.notes}</dd>
            </div>
          </dl>
        </div>

        <div className="fuzz-card space-y-3 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9c9c9c]">Contratos</h2>
          {client.contracts.length === 0 ? (
            <p className="text-sm text-[#9c9c9c]">Sin contratos cargados.</p>
          ) : (
            <ul className="space-y-3">
              {client.contracts.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-3"
                >
                  <div>
                    <p className="font-medium text-white">{c.title}</p>
                    <p className="text-xs text-[#9c9c9c]">
                      {c.type} · {formatDemoDate(`${c.signedAt}T12:00:00`)}
                    </p>
                  </div>
                  <span className="btn-fuzz-outline pointer-events-none text-xs opacity-80">
                    Ver PDF
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="btn-fuzz-outline pointer-events-none text-xs opacity-80">
            + Adjuntar contrato
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <header>
          <h2 className="fuzz-title text-xl">Instrumentos del cliente</h2>
          <p className="text-sm text-[#9c9c9c]">
            {client.instrumentCount} equipos vinculados a {client.clientNumber}
          </p>
        </header>
        <InstrumentTable
          items={client.instruments}
          showContact={false}
          showCatalogStatus
          admin
          pathPrefix={panelDemoPath()}
        />
      </section>
    </div>
  );
}
