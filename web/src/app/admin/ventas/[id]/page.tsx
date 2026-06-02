import Link from "next/link";
import { notFound } from "next/navigation";
import { SaleForm } from "@/components/SaleForm";
import { DeleteSaleButton } from "@/components/DeleteSaleButton";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditarVentaPage({ params }: Props) {
  const { id } = await params;
  const sale = await prisma.sale.findUnique({ where: { id } });
  if (!sale) notFound();

  return (
    <div className="space-y-4">
      <Link href="/admin/ventas" className="text-sm text-[#9c9c9c] hover:text-white">
        ← Ventas
      </Link>
      <SaleForm
        initial={{
          id: sale.id,
          historias: sale.historias,
          dia: sale.dia,
          titulo: sale.titulo,
          precioVentaUsd: sale.precioVentaUsd,
          porcentajeComision: sale.porcentajeComision,
          totalComisionFuzz: sale.totalComisionFuzz,
          mes: sale.mes,
          comKar: sale.comKar,
          comLean: sale.comLean,
          comFuzz: sale.comFuzz,
          anio: sale.anio,
        }}
      />
      <div className="mx-auto max-w-2xl">
        <DeleteSaleButton id={sale.id} titulo={sale.titulo} />
      </div>
    </div>
  );
}
