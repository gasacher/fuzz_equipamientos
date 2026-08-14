import { ClientCreateForm } from "@/components/ClientCreateForm";
import { ClientsList } from "@/components/ClientsList";
import { clientInstrumentsWhere } from "@/lib/client-instruments";
import { prisma } from "@/lib/prisma";

export default async function AdminClientesPage() {
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      clientNumber: true,
      email: true,
      phone: true,
    },
  });

  const withCounts = await Promise.all(
    clients.map(async (c) => ({
      ...c,
      instrumentCount: await prisma.instrument.count({
        where: clientInstrumentsWhere(c),
      }),
    })),
  );

  withCounts.sort((a, b) => b.instrumentCount - a.instrumentCount || a.name.localeCompare(b.name));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="fuzz-title text-2xl text-white md:text-3xl">Clientes</h1>
          <p className="mt-1 max-w-xl text-sm text-[#9c9c9c]">
            Un cliente, un perfil. Entrá al cliente para ver y editar todos sus instrumentos, contacto
            y contratos.
          </p>
        </div>
        <ClientCreateForm compact />
      </header>

      <ClientsList clients={withCounts} />
    </div>
  );
}
