import type { Metadata } from "next";
import Link from "next/link";
import { DemoAdminNav } from "@/components/demo/DemoAdminNav";
import { appPath } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "Panel FUZZ",
  description: "Panel de administración FUZZ — vista de demostración.",
};

export default function PublicDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-b border-[#e50914]/30 bg-[#1a0a0a] py-2 text-center text-xs text-[#9c9c9c]">
        <strong className="text-[#e50914]">Vista demo</strong> — mismos datos y diseño que el panel real.{" "}
        <Link href={appPath("/")} className="text-[#e50914] hover:underline">
          Inicio
        </Link>
      </div>
      <DemoAdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </>
  );
}
