import { InstrumentForm } from "@/components/InstrumentForm";
import { getInstrumentTaxonomy } from "@/lib/get-taxonomy";

export default async function NuevoInstrumentoPage() {
  const taxonomy = await getInstrumentTaxonomy();
  return <InstrumentForm taxonomy={taxonomy} />;
}
