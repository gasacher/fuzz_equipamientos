import type { Metadata } from "next";
import { CatalogSiteShell } from "@/components/CatalogSiteShell";

export const metadata: Metadata = {
  title: "Catálogo | FUZZ",
  description: "Catálogo de instrumentos en venta. Precios de referencia del inventario.",
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <CatalogSiteShell>{children}</CatalogSiteShell>;
}
