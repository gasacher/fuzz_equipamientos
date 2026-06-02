export function parseNumber(v: unknown): number | null {
  if (v == null || v === "" || v === "#REF!") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseBool(v: unknown): boolean {
  if (v === true || v === "TRUE" || v === "true" || v === 1) return true;
  return false;
}

export function parseString(v: unknown): string | null {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  return s || null;
}

export function parseHistorias(v: unknown): string | null {
  const s = parseString(v);
  if (!s || s === "-") return s === "-" ? "-" : null;
  return s;
}

export function isYearRow(row: unknown[]): boolean {
  const first = row[0];
  const titulo = row[2];
  return (
    typeof first === "number" &&
    first >= 2000 &&
    first < 2100 &&
    (titulo == null || titulo === "")
  );
}

export function isTotalRow(titulo: string | null): boolean {
  return titulo != null && titulo.toUpperCase() === "TOTAL";
}
