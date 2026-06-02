import Link from "next/link";
import { SaleForm } from "@/components/SaleForm";

export default function NuevaVentaPage() {
  return (
    <div className="space-y-4">
      <Link href="/admin/ventas" className="text-sm text-[#9c9c9c] hover:text-white">
        ← Ventas
      </Link>
      <SaleForm />
    </div>
  );
}
