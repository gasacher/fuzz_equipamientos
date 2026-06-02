import Link from "next/link";
import { FuzzLogo } from "@/components/FuzzLogo";

export function CatalogPublicNav() {
  return (
    <nav className="border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <FuzzLogo size="bar" href="/" />
        <Link href="/login" className="shrink-0 text-xs text-[#9c9c9c] hover:text-white md:text-sm">
          Acceso admin
        </Link>
      </div>
    </nav>
  );
}
