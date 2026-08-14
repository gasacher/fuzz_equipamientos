import { ClientsTable } from "@/components/demo/ClientsTable";
import { getDemoClients } from "@/lib/demo-features";
import { panelDemoPath } from "@/lib/panel-demo-path";

export default function DemoClientesPage() {
  const clients = getDemoClients();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="fuzz-title text-2xl text-white md:text-3xl">Clientes</h1>
        <p className="mt-1 text-sm text-[#9c9c9c]">
          Perfil con número de cliente, datos de contacto, contratos e instrumentos vinculados.
        </p>
      </header>

      <ClientsTable clients={clients} clientPath={(id) => panelDemoPath(`/clientes/${id}`)} />
    </div>
  );
}
