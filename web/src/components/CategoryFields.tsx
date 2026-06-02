"use client";

import { useMemo, useState } from "react";
import { ensureTaxonomyIncludes } from "@/lib/taxonomy";
import type { InstrumentTaxonomy } from "@/lib/taxonomy";

const NEW_VALUE = "__new__";

type Props = {
  taxonomy: InstrumentTaxonomy;
  initialCategoria?: string;
  initialSubcategoria?: string | null;
};

function resolveInitialSelect(value: string | undefined, options: string[]) {
  if (!value?.trim()) return "";
  const trimmed = value.trim();
  return options.includes(trimmed) ? trimmed : NEW_VALUE;
}

export function CategoryFields({
  taxonomy,
  initialCategoria = "",
  initialSubcategoria = null,
}: Props) {
  const enriched = useMemo(
    () => ensureTaxonomyIncludes(taxonomy, initialCategoria, initialSubcategoria),
    [taxonomy, initialCategoria, initialSubcategoria],
  );

  const [categoriaSelect, setCategoriaSelect] = useState(() =>
    resolveInitialSelect(initialCategoria, enriched.categories),
  );
  const [categoriaNew, setCategoriaNew] = useState(() =>
    categoriaSelect === NEW_VALUE ? initialCategoria.trim() : "",
  );

  const effectiveCategoria =
    categoriaSelect === NEW_VALUE ? categoriaNew.trim() : categoriaSelect;

  const subOptions = useMemo(() => {
    if (!effectiveCategoria) return [];
    return enriched.subcategoriesByCategory[effectiveCategoria] ?? [];
  }, [effectiveCategoria, enriched.subcategoriesByCategory]);

  const [subSelect, setSubSelect] = useState(() => {
    const cat = initialCategoria.trim();
    const opts = cat ? (enriched.subcategoriesByCategory[cat] ?? []) : [];
    return resolveInitialSelect(initialSubcategoria ?? undefined, opts);
  });
  const [subNew, setSubNew] = useState(() =>
    subSelect === NEW_VALUE ? (initialSubcategoria?.trim() ?? "") : "",
  );

  function onCategoriaChange(value: string) {
    setCategoriaSelect(value);
    if (value !== NEW_VALUE) {
      setCategoriaNew("");
      setSubSelect("");
      setSubNew("");
    }
  }

  const effectiveSub = subSelect === NEW_VALUE ? subNew.trim() : subSelect.trim();

  return (
    <>
      <input type="hidden" name="categoria" value={effectiveCategoria} />
      <input type="hidden" name="subcategoria" value={effectiveSub} />

      <label className="block space-y-1">
        <span className="text-xs text-[#9c9c9c]">Categoría *</span>
        <select
          className="fuzz-input"
          value={categoriaSelect}
          onChange={(e) => onCategoriaChange(e.target.value)}
          required={categoriaSelect !== NEW_VALUE}
        >
          <option value="">Elegir categoría…</option>
          {enriched.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value={NEW_VALUE}>+ Nueva categoría</option>
        </select>
        {categoriaSelect === NEW_VALUE && (
          <input
            className="fuzz-input mt-2"
            placeholder="Nombre de la nueva categoría"
            value={categoriaNew}
            onChange={(e) => setCategoriaNew(e.target.value)}
            required
          />
        )}
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-[#9c9c9c]">Sub-categoría</span>
        <select
          className="fuzz-input"
          value={subSelect}
          onChange={(e) => {
            setSubSelect(e.target.value);
            if (e.target.value !== NEW_VALUE) setSubNew("");
          }}
          disabled={!effectiveCategoria}
        >
          <option value="">Sin sub-categoría</option>
          {subOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          {effectiveCategoria && <option value={NEW_VALUE}>+ Nueva sub-categoría</option>}
        </select>
        {!effectiveCategoria && (
          <p className="mt-1 text-[11px] text-[#9c9c9c]">Elegí primero una categoría</p>
        )}
        {subSelect === NEW_VALUE && (
          <input
            className="fuzz-input mt-2"
            placeholder="Nombre de la nueva sub-categoría"
            value={subNew}
            onChange={(e) => setSubNew(e.target.value)}
          />
        )}
      </label>
    </>
  );
}
