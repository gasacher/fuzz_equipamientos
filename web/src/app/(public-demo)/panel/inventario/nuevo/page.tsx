import { DemoInstrumentoNuevo } from "@/components/demo/DemoInstrumentoNuevo";
import { getDemoTaxonomy } from "@/lib/demo-admin";

export default function DemoNuevoInstrumentoPage() {
  return <DemoInstrumentoNuevo taxonomy={getDemoTaxonomy()} />;
}
