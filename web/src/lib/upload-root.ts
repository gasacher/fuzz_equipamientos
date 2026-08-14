import path from "node:path";

export function uploadRoot(kind: "receipts" | "contracts") {
  const base = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");
  return path.join(base, kind);
}
