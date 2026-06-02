import { redirect } from "next/navigation";
import { InicioPage } from "@/components/demo/InicioPage";
import { isStaticCatalogSite } from "@/lib/site-path";

export default function HomePage() {
  if (!isStaticCatalogSite()) {
    redirect("/catalogo");
  }

  return <InicioPage />;
}
