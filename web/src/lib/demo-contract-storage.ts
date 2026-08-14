export type DemoContract = {
  id: string;
  title: string;
  type: string;
  signedAt: string;
  fileName: string | null;
  fileUrl: string | null;
};

type SeedContract = {
  id: string;
  title: string;
  type: string;
  signedAt: string;
};

const KEY = "fuzz-demo-contracts";

function readAll(): Record<string, DemoContract[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, DemoContract[]>;
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, DemoContract[]>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function fromSeed(seed: SeedContract[]): DemoContract[] {
  return seed.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    signedAt: item.signedAt,
    fileName: `${item.title}.pdf`,
    fileUrl: null,
  }));
}

export function getDemoContracts(clientId: string, seed: SeedContract[]): DemoContract[] {
  const stored = readAll()[clientId];
  if (stored) return stored;
  const initial = fromSeed(seed);
  writeAll({ ...readAll(), [clientId]: initial });
  return initial;
}

export function saveDemoContracts(clientId: string, contracts: DemoContract[]) {
  writeAll({ ...readAll(), [clientId]: contracts });
}

export function newDemoContractId() {
  return `c-demo-${Date.now()}`;
}
