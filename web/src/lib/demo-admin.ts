import adminDemo from "@/data/admin-demo.json";
import { buildTaxonomy, ensureTaxonomyIncludes } from "@/lib/taxonomy";

export { adminDemo };

export function getDemoTaxonomy() {
  return buildTaxonomy(adminDemo.instruments);
}

export function getDemoTaxonomyForInstrument(categoria: string, subcategoria: string | null) {
  return ensureTaxonomyIncludes(getDemoTaxonomy(), categoria, subcategoria);
}

export function getDemoInstrument(id: string) {
  return adminDemo.instruments.find((i) => i.id === id);
}

export function getDemoSale(id: string) {
  return adminDemo.sales.find((s) => s.id === id);
}

export function demoInstrumentStaticParams() {
  return adminDemo.instruments.map((i) => ({ id: i.id }));
}

export function demoSaleStaticParams() {
  return adminDemo.sales.map((s) => ({ id: s.id }));
}
