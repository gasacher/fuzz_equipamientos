import { DemoClientsView } from "@/components/demo/DemoClientsView";
import { getDemoClients } from "@/lib/demo-features";

export default function DemoClientesPage() {
  const clients = getDemoClients();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="fuzz-title text-2xl text-white md:text-3xl">Clientes</h1>
        <p className="mt-1 text-sm text-[#9c9c9c]">
          Cada tarjeta es un cliente. Abrí la ficha para ver y editar nombre, teléfono, email,
          contratos e instrumentos.
        </p>
      </header>

      <DemoClientsView
        clients={clients.map((c) => ({
          id: c.id,
          name: c.name,
          clientNumber: c.clientNumber,
          email: c.email,
          phone: c.phone,
          instrumentCount: c.instrumentCount,
        }))}
      />
    </div>
  );
}
