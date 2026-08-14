"use client";

import { useEffect, useState } from "react";
import adminDemo from "@/data/admin-demo.json";
import type { InstrumentRow } from "@/components/InstrumentTable";
import { getDemoNewInstrument } from "@/lib/demo-inventory-storage";

export function useDemoInstrument(id: string): InstrumentRow | null {
  const [item, setItem] = useState<InstrumentRow | null>(() => {
    const fromJson = adminDemo.instruments.find((i) => i.id === id);
    if (fromJson) return fromJson;
    return getDemoNewInstrument(id);
  });

  useEffect(() => {
    const fromJson = adminDemo.instruments.find((i) => i.id === id);
    setItem(fromJson ?? getDemoNewInstrument(id));
  }, [id]);

  return item;
}
