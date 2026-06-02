const MONTH_ORDER = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
] as const;

export type MonthSalesStat = {
  mes: string;
  ventasUsd: number;
  comisionFuzz: number;
  count: number;
};

type SaleSlice = {
  mes: string | null;
  precioVentaUsd: number | null;
  totalComisionFuzz: number | null;
};

export function aggregateSalesByMonth(sales: SaleSlice[]): MonthSalesStat[] {
  const map = new Map<string, MonthSalesStat>();

  for (const s of sales) {
    const mes = (s.mes?.trim().toUpperCase() || "SIN MES") as string;
    const cur = map.get(mes) ?? { mes, ventasUsd: 0, comisionFuzz: 0, count: 0 };
    cur.ventasUsd += s.precioVentaUsd ?? 0;
    cur.comisionFuzz += s.totalComisionFuzz ?? 0;
    cur.count += 1;
    map.set(mes, cur);
  }

  const result = [...map.values()];

  result.sort((a, b) => {
    const ia = MONTH_ORDER.indexOf(a.mes as (typeof MONTH_ORDER)[number]);
    const ib = MONTH_ORDER.indexOf(b.mes as (typeof MONTH_ORDER)[number]);
    if (ia >= 0 && ib >= 0) return ia - ib;
    if (ia >= 0) return -1;
    if (ib >= 0) return 1;
    if (a.mes === "SIN MES") return 1;
    if (b.mes === "SIN MES") return -1;
    return a.mes.localeCompare(b.mes, "es");
  });

  return result;
}

export function formatUsd(n: number) {
  return `$${n.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
}
