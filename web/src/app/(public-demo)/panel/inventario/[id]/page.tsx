import { DemoInstrumentoDetalleClient } from "@/components/demo/DemoInstrumentoDetalleClient";
import { demoInstrumentStaticParams } from "@/lib/demo-admin";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoInstrumentStaticParams();
}

export default async function DemoInstrumentoDetallePage({ params }: Props) {
  const { id } = await params;
  return <DemoInstrumentoDetalleClient id={id} />;
}
