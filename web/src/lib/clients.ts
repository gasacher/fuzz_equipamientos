import { prisma } from "@/lib/prisma";

export async function nextClientNumber() {
  const count = await prisma.client.count();
  return `FUZZ-${String(count + 1).padStart(4, "0")}`;
}
