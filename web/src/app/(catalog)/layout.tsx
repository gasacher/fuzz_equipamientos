import type { Metadata } from "next";
import { CatalogSiteShell } from "@/components/CatalogSiteShell";

export const metadata: Metadata = {
  title: "Catálogo | FUZZ",
  description:
    "Catálogo FUZZ: instrumentos y backline en venta. Precios en USD, consulta por WhatsApp y visitas al showroom en Buenos Aires.",
};

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <CatalogSiteShell>{children}</CatalogSiteShell>;
}
