import Image from "next/image";
import Link from "next/link";
import { getInstrumentImage, isExternalImage } from "@/lib/catalog-images";
import { formatCatalogPrice, formatUsd } from "@/lib/format-price";
import { WhatsAppButton } from "./WhatsAppButton";

export type ProductData = {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria: string | null;
  marca: string | null;
  anio: string | null;
  origen: string | null;
  descripcion: string | null;
  imageUrl: string | null;
  ig: string | null;
  valorUsd: number | null;
};

function ProductImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  if (isExternalImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
    );
  }
  return (
    <div className="relative aspect-[4/3] w-full">
      <Image src={src} alt={alt} fill className="object-cover" priority={priority} sizes="(max-width:1024px) 100vw, 50vw" />
    </div>
  );
}

export function CatalogProduct({
  product,
  catalogBasePath = "/",
}: {
  product: ProductData;
  catalogBasePath?: string;
}) {
  const imageSrc = getInstrumentImage(product.categoria, product.imageUrl);
  const tags = [product.categoria, product.subcategoria, product.marca, product.anio].filter(Boolean);

  const specs: [string, string][] = [];
  if (product.marca) specs.push(["Marca", product.marca]);
  if (product.anio) specs.push(["Año", product.anio]);
  if (product.origen) specs.push(["Origen", product.origen]);
  if (product.subcategoria) specs.push(["Tipo", product.subcategoria]);
  if (product.valorUsd != null) specs.push(["Precio", formatUsd(product.valorUsd) ?? "—"]);

  const priceLabel = formatCatalogPrice(product.valorUsd);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-[#9c9c9c]">
        <Link href={catalogBasePath} className="hover:text-white">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#f2f2f2]">{product.titulo}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#0f0f0f]">
            <ProductImage src={imageSrc} alt={product.titulo} priority />
            <span className="absolute left-3 top-3 rounded bg-[#e50914] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              Venta
            </span>
          </div>
          <p className="mt-2 text-xs text-[#9c9c9c]">
            Imágenes ilustrativas según categoría. Consultá disponibilidad y configuración exacta.
          </p>
          {product.ig && (
            <a
              href={product.ig}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-[#e50914] hover:underline"
            >
              Ver en Instagram →
            </a>
          )}
        </div>

        <div>
          <h1 className="fuzz-title text-2xl leading-tight text-white md:text-3xl">{product.titulo}</h1>
          <p className="mt-2 text-2xl font-semibold text-[#e50914]">{priceLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded border border-[#2a2a2a] bg-[#141414] px-2 py-0.5 text-xs text-[#bdbdbd]"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[#f2f2f2] leading-relaxed">
            {product.descripcion ??
              `Instrumento en venta — ${product.categoria}. Consultanos por WhatsApp para coordinar la compra.`}
          </p>

          {specs.length > 0 && (
            <table className="mt-6 w-full text-sm">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} className="border-b border-[#1c1c1c]">
                    <th className="py-2 pr-4 text-left font-medium text-[#9c9c9c]">{k}</th>
                    <td className="py-2 text-white">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-8">
            <WhatsAppButton titulo={product.titulo} precio={priceLabel} />
          </div>

          <p className="mt-3 text-xs text-[#9c9c9c]">
            Precios del inventario. Consultá por formas de pago y envío.
          </p>
        </div>
      </div>
    </div>
  );
}
