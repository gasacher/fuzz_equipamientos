export type InstrumentTaxonomy = {
  categories: string[];
  subcategoriesByCategory: Record<string, string[]>;
};

export function buildTaxonomy(
  items: { categoria: string; subcategoria: string | null }[],
): InstrumentTaxonomy {
  const categories = new Set<string>();
  const subs = new Map<string, Set<string>>();

  for (const item of items) {
    const cat = item.categoria.trim();
    if (!cat) continue;
    categories.add(cat);
    const sub = item.subcategoria?.trim();
    if (sub) {
      if (!subs.has(cat)) subs.set(cat, new Set());
      subs.get(cat)!.add(sub);
    }
  }

  const subcategoriesByCategory: Record<string, string[]> = {};
  for (const [cat, set] of subs) {
    subcategoriesByCategory[cat] = [...set].sort((a, b) => a.localeCompare(b, "es"));
  }

  return {
    categories: [...categories].sort((a, b) => a.localeCompare(b, "es")),
    subcategoriesByCategory,
  };
}

export function ensureTaxonomyIncludes(
  taxonomy: InstrumentTaxonomy,
  categoria: string,
  subcategoria: string | null,
): InstrumentTaxonomy {
  const cat = categoria.trim();
  const sub = subcategoria?.trim() || null;
  const categories = new Set(taxonomy.categories);
  const subs = { ...taxonomy.subcategoriesByCategory };

  if (cat) categories.add(cat);
  if (cat && sub) {
    const list = new Set(subs[cat] ?? []);
    list.add(sub);
    subs[cat] = [...list].sort((a, b) => a.localeCompare(b, "es"));
  }

  return {
    categories: [...categories].sort((a, b) => a.localeCompare(b, "es")),
    subcategoriesByCategory: subs,
  };
}
