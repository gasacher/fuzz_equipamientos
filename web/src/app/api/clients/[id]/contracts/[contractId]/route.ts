import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateReceiptFile } from "@/lib/receipt-file";
import { uploadRoot } from "@/lib/upload-root";

type Params = { params: Promise<{ id: string; contractId: string }> };

const UPLOAD_ROOT = uploadRoot("contracts");

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "contrato";
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: clientId, contractId } = await params;
  const existing = await prisma.contract.findFirst({ where: { id: contractId, clientId } });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim() || existing.title;
  const type = String(formData.get("type") ?? "").trim() || existing.type;
  const signedAtRaw = String(formData.get("signedAt") ?? "");
  const signedAt = signedAtRaw ? new Date(signedAtRaw) : existing.signedAt;
  if (Number.isNaN(signedAt.getTime())) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const file = formData.get("file");
  let fileName = existing.fileName;
  let filePath = existing.filePath;

  if (file instanceof File && file.size > 0) {
    const validationError = validateReceiptFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    fileName = safeFileName(file.name);
    const dir = path.join(UPLOAD_ROOT, clientId);
    await mkdir(dir, { recursive: true });
    const diskPath = path.join(dir, `${contractId}__${fileName}`);
    await writeFile(diskPath, Buffer.from(await file.arrayBuffer()));
    filePath = `${clientId}/${contractId}__${fileName}`;
  }

  const contract = await prisma.contract.update({
    where: { id: contractId },
    data: { title, type, signedAt, fileName, filePath },
  });

  return NextResponse.json(contract);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: clientId, contractId } = await params;
  const existing = await prisma.contract.findFirst({ where: { id: contractId, clientId } });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.contract.delete({ where: { id: contractId } });
  return NextResponse.json({ ok: true });
}
