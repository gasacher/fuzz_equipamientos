import Link from "next/link";
import { AlertBadge } from "@/components/demo/AlertBadge";
import { StatusBadge } from "@/components/demo/StatusBadge";
import { TagBadge } from "@/components/demo/TagBadge";
import type { AlertLevel } from "@/lib/internal-control";

export type QueueRow = {
  instrumentId: string;
  titulo: string;
  categoria: string;
  contacto: string | null;
  status: string;
  tags: string[];
  daysSince: number;
  alert: AlertLevel | string;
  note: string;
};

type Props = {
  items: QueueRow[];
  instrumentPath: (id: string) => string;
};

export function PendingQueueTable({ items, instrumentPath }: Props) {
  if (items.length === 0) {
    return (
      <div className="fuzz-card p-8 text-center text-sm text-[#9c9c9c]">
        No hay pendientes en la cola.
      </div>
    );
  }

  return (
    <div className="fuzz-card overflow-x-auto">
      <table className="fuzz-table w-full text-sm">
        <thead>
          <tr>
            <th>Alerta</th>
            <th>Producto</th>
            <th>Estado</th>
            <th>Tags</th>
            <th>Días</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.instrumentId}>
              <td>
                <AlertBadge level={item.alert as AlertLevel} />
              </td>
              <td>
                <Link
                  href={instrumentPath(item.instrumentId)}
                  className="font-medium text-white hover:text-[#e50914]"
                >
                  {item.titulo}
                </Link>
                <p className="text-xs text-[#9c9c9c]">
                  {item.categoria}
                  {item.contacto ? ` · ${item.contacto}` : ""}
                </p>
              </td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </div>
              </td>
              <td className="font-mono text-[#ffb020]">{item.daysSince}d</td>
              <td className="max-w-xs text-xs text-[#9c9c9c]">{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
