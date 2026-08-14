import { getStatusLabel } from "@/lib/instrument-status";

const statusColors: Record<string, string> = {
  ingresado: "bg-[#333] text-[#ccc]",
  pendiente_foto: "bg-[#4a3000] text-[#ffb020]",
  foteado: "bg-[#1a3a4a] text-[#7ec8e3]",
  publicado: "bg-[#0a3a1a] text-[#6fcf97]",
  en_showroom: "bg-[#1a1a4a] text-[#a0a0ff]",
  con_cliente: "bg-[#3a1a4a] text-[#d4a0ff]",
  vendido: "bg-[#4a0a0a] text-[#ff8080]",
  entregado: "bg-[#1c1c1c] text-[#9c9c9c]",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = statusColors[status] ?? "bg-[#333] text-[#ccc]";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {getStatusLabel(status)}
    </span>
  );
}
