import { DemoInstrumentoEditarClient } from "@/components/demo/DemoInstrumentoEditarClient";
import { demoInstrumentStaticParams } from "@/lib/demo-admin";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoInstrumentStaticParams();
}

export default async function DemoEditarInstrumentoPage({ params }: Props) {
  const { id } = await params;
  return <DemoInstrumentoEditarClient id={id} />;
}
