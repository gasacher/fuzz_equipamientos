import { revalidatePath } from "next/cache";

/** Invalida el catálogo web público tras cambios en el inventario. */
export function revalidateClientCatalog(instrumentId?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin/catalogo");
  if (instrumentId) {
    revalidatePath(`/equipo/${instrumentId}`);
    revalidatePath(`/admin/catalogo/${instrumentId}`);
  }
}
