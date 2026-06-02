import type { Prisma } from "@/generated/prisma/client";
import { parseHistorias, parseNumber, parseString } from "@/lib/excel-parse";

export type SaleInput = {
  historias?: string | null;
  dia?: string | null;
  titulo: string;
  precioVentaUsd?: number | null;
  porcentajeComision?: number | null;
  totalComisionFuzz?: number | null;
  mes?: string | null;
  comKar?: number | null;
  comLean?: number | null;
  comFuzz?: number | null;
  anio?: number | null;
};

export function toSaleData(input: SaleInput): Prisma.SaleCreateInput {
  return {
    historias: input.historias ?? null,
    dia: input.dia ?? null,
    titulo: input.titulo.trim(),
    precioVentaUsd: input.precioVentaUsd ?? null,
    porcentajeComision: input.porcentajeComision ?? null,
    totalComisionFuzz: input.totalComisionFuzz ?? null,
    mes: input.mes ?? null,
    comKar: input.comKar ?? null,
    comLean: input.comLean ?? null,
    comFuzz: input.comFuzz ?? null,
    anio: input.anio ?? null,
  };
}

export type VentasRow = {
  historias: string | null;
  dia: string | null;
  titulo: string;
  precioVentaUsd: number | null;
  porcentajeComision: number | null;
  totalComisionFuzz: number | null;
  mes: string | null;
  comKar: number | null;
  comLean: number | null;
  comFuzz: number | null;
  anio: number | null;
};

export function parseVentasFromSheet(rows: Record<string, unknown>[]): VentasRow[] {
  const sales: VentasRow[] = [];
  let currentYear: number | null = new Date().getFullYear();
  let currentMes: string | null = null;

  for (const row of rows) {
    const historiasRaw = row["Historias"];
    const dia = parseString(row["Dia"]);
    const titulo = parseString(row["Título"] ?? row["Titulo"]);
    const mesCell = parseString(row["Mes"]);

    if (historiasRaw != null && typeof historiasRaw === "number" && historiasRaw >= 2000 && historiasRaw < 2100 && !titulo) {
      currentYear = Math.floor(historiasRaw);
      continue;
    }

    if (!titulo || isTotalRow(titulo)) continue;

    if (mesCell) currentMes = mesCell;

    sales.push({
      historias: parseHistorias(historiasRaw),
      dia,
      titulo,
      precioVentaUsd: parseNumber(row["Precio venta dls"]),
      porcentajeComision: parseNumber(row["% de comision"]),
      totalComisionFuzz: parseNumber(row["Total comisión FUZZ"] ?? row["Total comision FUZZ"]),
      mes: mesCell ?? currentMes,
      comKar: parseNumber(row["Com Kar"]),
      comLean: parseNumber(row["Com Lean"]),
      comFuzz: parseNumber(row["Com Fuzz"]),
      anio: currentYear,
    });
  }

  return sales;
}

function isTotalRow(titulo: string): boolean {
  return titulo.toUpperCase() === "TOTAL";
}
