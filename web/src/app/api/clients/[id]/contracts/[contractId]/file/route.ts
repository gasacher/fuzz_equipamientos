import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadRoot } from "@/lib/upload-root";

type Params = { params: Promise<{ id: string; contractId: string }> };

const UPLOAD_ROOT = uploadRoot("contracts");

function contentTypeFor(name: string) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

export async function GET(_request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: clientId, contractId } = await params;
  const contract = await prisma.contract.findFirst({
    where: { id: contractId, clientId },
    select: { filePath: true, fileName: true },
  });

  if (!contract?.filePath) {
    return NextResponse.json({ error: "Sin archivo" }, { status: 404 });
  }

  const diskPath = path.join(UPLOAD_ROOT, contract.filePath);
  const buffer = await readFile(diskPath);
  const fileName = contract.fileName ?? "contrato";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentTypeFor(fileName),
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
