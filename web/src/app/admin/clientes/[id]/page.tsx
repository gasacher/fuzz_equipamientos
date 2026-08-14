import { notFound } from "next/navigation";
import { AdminClienteProfile } from "@/components/AdminClienteProfile";
import {
  clientInstrumentListSelect,
  clientInstrumentsWhere,
} from "@/lib/client-instruments";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminClienteDetallePage({ params }: Props) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contracts: { orderBy: { signedAt: "desc" } },
    },
  });

  if (!client) notFound();

  const instruments = await prisma.instrument.findMany({
    where: clientInstrumentsWhere(client),
    orderBy: [{ categoria: "asc" }, { titulo: "asc" }],
    select: clientInstrumentListSelect,
  });

  return (
    <AdminClienteProfile
      client={{
        id: client.id,
        clientNumber: client.clientNumber,
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
        contracts: client.contracts.map((c) => ({
          ...c,
          signedAt: c.signedAt.toISOString(),
        })),
        instruments,
      }}
    />
  );
}
