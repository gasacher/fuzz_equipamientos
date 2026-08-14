import { notFound } from "next/navigation";
import { DemoClienteProfile } from "@/components/demo/DemoClienteProfile";
import { demoClientStaticParams, getDemoClient } from "@/lib/demo-features";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return demoClientStaticParams();
}

export default async function DemoClientePerfilPage({ params }: Props) {
  const { id } = await params;
  const client = getDemoClient(id);
  if (!client) notFound();

  return (
    <DemoClienteProfile
      client={{
        id: client.id,
        clientNumber: client.clientNumber,
        name: client.name,
        phone: client.phone,
        email: client.email,
        notes: client.notes,
        instrumentCount: client.instrumentCount,
        contracts: client.contracts,
        instruments: client.instruments,
      }}
    />
  );
}
