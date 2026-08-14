import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateReceiptFile } from "@/lib/receipt-file";
import { uploadRoot } from "@/lib/upload-root";

type Params = { params: Promise<{ id: string }> };

const UPLOAD_ROOT = uploadRoot("contracts");

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "contrato";
}

function contentTypeFor(name: string) {
  const ext = path.extname(name).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

export async function POST(request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: clientId } = await params;
  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { id: true } });
  if (!client) return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });

  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim() || "Consignación";
  const signedAtRaw = String(formData.get("signedAt") ?? "");
  const file = formData.get("file");

  if (!title) return NextResponse.json({ error: "Título requerido" }, { status: 400 });

  const signedAt = signedAtRaw ? new Date(signedAtRaw) : new Date();
  if (Number.isNaN(signedAt.getTime())) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  let fileName: string | null = null;
  let filePath: string | null = null;

  if (file instanceof File && file.size > 0) {
    const validationError = validateReceiptFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }
    fileName = safeFileName(file.name);
    const contractId = crypto.randomUUID();
    const dir = path.join(UPLOAD_ROOT, clientId);
    await mkdir(dir, { recursive: true });
    const diskPath = path.join(dir, `${contractId}__${fileName}`);
    await writeFile(diskPath, Buffer.from(await file.arrayBuffer()));
    filePath = `${clientId}/${contractId}__${fileName}`;

    const contract = await prisma.contract.create({
      data: { id: contractId, clientId, title, type, signedAt, fileName, filePath },
    });
    return NextResponse.json(contract, { status: 201 });
  }

  const contract = await prisma.contract.create({
    data: { clientId, title, type, signedAt },
  });

  return NextResponse.json(contract, { status: 201 });
}
