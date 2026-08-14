"use client";

import { useRouter } from "next/navigation";

type ClientRow = {
  id: string;
  clientNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
  instrumentCount: number;
};

type Props = {
  clients: ClientRow[];
  clientPath: (id: string) => string;
};

export function ClientsTable({ clients, clientPath }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <p className="text-sm text-[#9c9c9c]">
        {clients.length} clientes · Tocá cualquier fila para abrir el perfil (contacto, contratos e
        instrumentos)
      </p>
      <div className="fuzz-card overflow-x-auto">
        <table className="fuzz-table w-full text-sm">
          <thead>
            <tr>
              <th>Nº cliente</th>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Instrumentos</th>
              <th>
                <span className="sr-only">Abrir</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr
                key={c.id}
                role="link"
                tabIndex={0}
                aria-label={`Abrir perfil de ${c.name}`}
                className="cursor-pointer transition"
                onClick={() => router.push(clientPath(c.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(clientPath(c.id));
                  }
                }}
              >
                <td className="font-mono text-[#e50914]">{c.clientNumber}</td>
                <td className="font-medium text-white">{c.name}</td>
                <td className="text-[#9c9c9c]">
                  {c.phone ?? "—"}
                  {c.email ? <span className="block text-xs">{c.email}</span> : null}
                </td>
                <td>{c.instrumentCount}</td>
                <td className="whitespace-nowrap text-right">
                  <span className="inline-flex items-center rounded-lg border border-[#e50914]/50 bg-[#1a0a0a] px-3 py-1.5 text-xs font-semibold text-[#e50914]">
                    Ver perfil →
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
