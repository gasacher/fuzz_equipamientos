export type DemoClientEdit = {
  name: string;
  clientNumber: string;
  phone: string;
  email: string;
  notes: string;
};

const KEY = "fuzz-demo-client-edits";

function readEdits(): Record<string, DemoClientEdit> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, DemoClientEdit>;
  } catch {
    return {};
  }
}

function writeEdits(edits: Record<string, DemoClientEdit>) {
  localStorage.setItem(KEY, JSON.stringify(edits));
}

export function getDemoClientEdit(id: string): DemoClientEdit | null {
  return readEdits()[id] ?? null;
}

export function saveDemoClientEdit(id: string, edit: DemoClientEdit) {
  writeEdits({ ...readEdits(), [id]: edit });
}

export function applyDemoClientEdit<T extends {
  id: string;
  name: string;
  clientNumber?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}>(client: T): T {
  const edit = getDemoClientEdit(client.id);
  if (!edit) return client;
  return {
    ...client,
    name: edit.name,
    clientNumber: edit.clientNumber,
    phone: edit.phone || null,
    email: edit.email || null,
    notes: edit.notes || null,
  };
}
