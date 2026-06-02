import Link from "next/link";
import { panelDemoPath } from "@/lib/panel-demo-path";

export function ClientePresentacionBanner() {
  return (
    <div className="fuzz-card mb-6 border-[#e50914]/50 bg-gradient-to-r from-[#1a0a0a] to-[#111] p-4 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#e50914]">
        Presentación FUZZ
      </p>
      <p className="mt-2 text-sm text-[#f2f2f2] md:text-base">
        Estás viendo el <strong>catálogo público</strong> (lo que ven los compradores). Para ver cómo
        gestionás stock, ventas y Excel, abrí el{" "}
        <Link href={panelDemoPath()} className="text-[#e50914] font-semibold hover:underline">
          panel de administración (demo)
        </Link>
        .
      </p>
    </div>
  );
}
