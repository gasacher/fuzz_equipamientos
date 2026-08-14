import type { InstrumentRow } from "@/components/InstrumentTable";

const KEY = "fuzz-demo-new-items";

export type DemoNewInstrument = InstrumentRow & { id: string };

function readItems(): DemoNewInstrument[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as DemoNewInstrument[];
  } catch {
    return [];
  }
}

function writeItems(items: DemoNewInstrument[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function saveDemoNewInstrument(item: DemoNewInstrument) {
  writeItems([item, ...readItems()]);
}

export function getDemoNewInstruments(): DemoNewInstrument[] {
  return readItems();
}

export function getDemoNewInstrument(id: string): DemoNewInstrument | null {
  return readItems().find((i) => i.id === id) ?? null;
}

export function newDemoInstrumentId() {
  return `demo-nuevo-${Date.now()}`;
}
