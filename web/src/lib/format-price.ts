export function formatUsd(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return null;
  return `USD ${value.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}

export function formatCatalogPrice(valorUsd: number | null) {
  return formatUsd(valorUsd) ?? "Consultar precio";
}
