import adminDemo from "@/data/admin-demo.json";
import { buildTaxonomy, ensureTaxonomyIncludes } from "@/lib/taxonomy";
import {
  getGhPagesShowcaseInstrumentIds,
  getGhPagesShowcaseSaleIds,
} from "@/lib/demo-features";

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
  if (process.env.GITHUB_PAGES === "true") {
    return getGhPagesShowcaseInstrumentIds().map((id) => ({ id }));
  }
  return adminDemo.instruments.map((i) => ({ id: i.id }));
}

export function demoSaleStaticParams() {
  if (process.env.GITHUB_PAGES === "true") {
    return getGhPagesShowcaseSaleIds().map((id) => ({ id }));
  }
  return adminDemo.sales.map((s) => ({ id: s.id }));
}
