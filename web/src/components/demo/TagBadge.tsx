const tagLabels: Record<string, string> = {
  falta_foto: "Falta foto",
  urgente: "Urgente",
  borrador: "Borrador",
  sin_precio: "Sin precio",
  pendiente_publicar: "Pendiente publicar",
  revisar_precio: "Revisar precio",
  consignacion: "Consignación",
  showroom: "Showroom",
  vendido: "Vendido",
};

export function TagBadge({ tag }: { tag: string }) {
  const urgent = tag === "urgente" || tag === "falta_foto";
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-xs ${
        urgent
          ? "border-[#e50914]/50 bg-[#1a0a0a] text-[#e50914]"
          : "border-[#333] bg-[#111] text-[#9c9c9c]"
      }`}
    >
      {tagLabels[tag] ?? tag}
    </span>
  );
}
