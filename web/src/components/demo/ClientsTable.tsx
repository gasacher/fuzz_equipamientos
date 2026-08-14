import Link from "next/link";

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
  return (
    <div className="fuzz-card overflow-x-auto">
      <table className="fuzz-table w-full text-sm">
        <thead>
          <tr>
            <th>Nº cliente</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Instrumentos</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td className="font-mono text-[#e50914]">{c.clientNumber}</td>
              <td>
                <Link href={clientPath(c.id)} className="font-medium text-white hover:text-[#e50914]">
                  {c.name}
                </Link>
              </td>
              <td className="text-[#9c9c9c]">
                {c.phone ?? "—"}
                {c.email ? <span className="block text-xs">{c.email}</span> : null}
              </td>
              <td>{c.instrumentCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
