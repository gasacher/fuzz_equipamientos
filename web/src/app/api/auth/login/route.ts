import { NextResponse } from "next/server";
import { loginWithEmail } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
  }

  const session = await loginWithEmail(email, password);
  if (!session) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Acceso solo para administradores" }, { status: 403 });
  }

  return NextResponse.json({
    role: session.role,
    redirect: "/admin",
  });
}
