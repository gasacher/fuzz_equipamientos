"use client";

import { useEffect, useState } from "react";
import { applyDemoClientEdit } from "@/lib/demo-client-storage";
import { panelDemoPath } from "@/lib/panel-demo-path";
import { ClientsList, type ClientListRow } from "@/components/ClientsList";

type Props = {
  clients: ClientListRow[];
};

export function DemoClientsView({ clients }: Props) {
  const [merged, setMerged] = useState(clients);

  useEffect(() => {
    setMerged(clients.map((c) => applyDemoClientEdit(c)));
  }, [clients]);

  return (
    <ClientsList
      clients={merged}
      clientHref={(id) => panelDemoPath(`/clientes/${id}`)}
    />
  );
}
