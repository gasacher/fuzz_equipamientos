import { StatusBadge } from "@/components/demo/StatusBadge";
import { TagBadge } from "@/components/demo/TagBadge";
import { PublishedNetworksDisplay } from "@/components/demo/PublishedNetworksDisplay";
import type { DemoTraceability } from "@/lib/demo-features";

type Props = {
  trace: DemoTraceability;
};

export function InstrumentTraceabilityCard({ trace }: Props) {
  return (
    <div className="fuzz-card space-y-4 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="fuzz-title text-lg">Trazabilidad</h2>
          <p className="mt-1 text-sm text-[#9c9c9c]">Estado, ubicación y seguimiento del producto.</p>
        </div>
        <StatusBadge status={trace.status} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-4">
          <span className="text-xs text-[#9c9c9c]">Ubicación actual</span>
          <p className="mt-1 font-medium text-white">{trace.location}</p>
        </div>
        {trace.daysPending != null && (
          <div className="rounded-lg border border-[#e50914]/30 bg-[#1a0a0a] p-4">
            <span className="text-xs text-[#9c9c9c]">Demora</span>
            <p className="mt-1 font-medium text-[#ffb020]">{trace.daysPending} días pendiente</p>
          </div>
        )}
      </div>

      {trace.status === "publicado" && trace.published && (
        <div className="rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-4">
          <span className="text-xs text-[#9c9c9c]">Publicado en</span>
          <PublishedNetworksDisplay source={trace.published} />
        </div>
      )}

      {trace.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {trace.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
      )}
    </div>
  );
}
