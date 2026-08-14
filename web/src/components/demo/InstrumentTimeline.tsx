import type { DemoHistoryEvent } from "@/lib/demo-features";
import { formatDemoDate } from "@/lib/demo-features";

const dotColors: Record<string, string> = {
  ingreso: "bg-[#9c9c9c]",
  foto: "bg-[#7ec8e3]",
  publicacion: "bg-[#6fcf97]",
  ubicacion: "bg-[#a0a0ff]",
  venta: "bg-[#e50914]",
  entrega: "bg-[#666]",
  nota: "bg-[#ffb020]",
};

type Props = {
  events: DemoHistoryEvent[];
  buyer?: string | null;
  receipt?: { name: string; date: string; url?: string } | null;
};

export function InstrumentTimeline({ events, buyer, receipt }: Props) {
  const sorted = [...events].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="fuzz-card p-6">
      <h2 className="fuzz-title mb-4 text-lg">Historial del producto</h2>
      <p className="mb-6 text-sm text-[#9c9c9c]">
        Cada cambio de estado, ubicación o venta queda registrado con fecha y hora.
      </p>

      {(buyer || receipt) && (
        <div className="mb-6 grid gap-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-4 sm:grid-cols-2">
          {buyer && (
            <div>
              <span className="text-xs text-[#9c9c9c]">Comprador</span>
              <p className="font-medium text-white">{buyer}</p>
            </div>
          )}
          {receipt && (
            <div>
              <span className="text-xs text-[#9c9c9c]">Recibo</span>
              {receipt.url ? (
                <a
                  href={receipt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={receipt.name}
                  className="block font-medium text-[#e50914] hover:underline"
                >
                  {receipt.name}
                </a>
              ) : (
                <p className="font-medium text-[#e50914]">{receipt.name}</p>
              )}
              <p className="text-xs text-[#9c9c9c]">{receipt.date}</p>
            </div>
          )}
        </div>
      )}

      <ol className="relative space-y-0 border-l border-[#333] pl-6">
        {sorted.map((ev, i) => (
          <li key={`${ev.at}-${i}`} className="relative pb-6 last:pb-0">
            <span
              className={`absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full ring-4 ring-black ${dotColors[ev.type] ?? "bg-[#666]"}`}
            />
            <time className="text-xs text-[#9c9c9c]">{formatDemoDate(ev.at)}</time>
            <p className="mt-0.5 font-medium text-white">{ev.title}</p>
            <p className="mt-1 text-sm text-[#9c9c9c]">{ev.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
