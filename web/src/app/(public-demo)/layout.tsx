import type { Metadata } from "next";
import { DemoPublicNav } from "@/components/DemoPublicNav";

export const metadata: Metadata = {
  title: "Panel demo | FUZZ",
  description: "Vista de demostración del panel de administración FUZZ.",
};

export default function PublicDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <DemoPublicNav active="panel" />
      <main className="mx-auto max-w-7xl px-4 py-8 pb-16">{children}</main>
      <footer className="border-t border-white/10 py-6 text-center text-sm text-[#9c9c9c]">
        © FUZZ · Vista demo para presentación
      </footer>
    </div>
  );
}
