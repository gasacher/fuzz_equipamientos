import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateReceiptFile } from "@/lib/receipt-file";
import { uploadRoot } from "@/lib/upload-root";

type Params = { params: Promise<{ id: string }> };

const UPLOAD_ROOT = uploadRoot("receipts");

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "recibo";
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

  const { id } = await params;
  const exists = await prisma.instrument.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  const validationError = validateReceiptFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const fileName = safeFileName(file.name);
  const dir = path.join(UPLOAD_ROOT, id);
  await mkdir(dir, { recursive: true });
  const diskPath = path.join(dir, fileName);
  await writeFile(diskPath, Buffer.from(await file.arrayBuffer()));

  const receiptPath = `${id}/${fileName}`;
  const item = await prisma.instrument.update({
    where: { id },
    data: { receiptName: fileName, receiptPath },
  });

  return NextResponse.json({ receiptName: item.receiptName, receiptPath: item.receiptPath });
}

export async function GET(_request: Request, { params }: Params) {
  const session = await requireSession("ADMIN");
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const item = await prisma.instrument.findUnique({
    where: { id },
    select: { receiptPath: true, receiptName: true },
  });
  if (!item?.receiptPath) {
    return NextResponse.json({ error: "Sin recibo" }, { status: 404 });
  }

  const diskPath = path.join(UPLOAD_ROOT, item.receiptPath);
  const buffer = await readFile(diskPath);
  const fileName = item.receiptName ?? "recibo";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentTypeFor(fileName),
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
