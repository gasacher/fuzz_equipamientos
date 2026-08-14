import Link from "next/link";
import { withBasePath } from "@/lib/site-path";

const LOGO_SRC = withBasePath("/assets/img/logo-fuzz.png");

type Props = {
  /** Barra superior (web + admin) */
  size?: "bar" | "login" | "footer";
  href?: string;
  className?: string;
};

const sizeClass = {
  bar: "h-12 w-auto sm:h-14 md:h-16",
  login: "h-16 w-auto md:h-20",
  footer: "h-16 w-auto md:h-[4.5rem]",
} as const;

export function FuzzLogo({ size = "bar", href, className = "" }: Props) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="FUZZ Equipamientos"
      width={868}
      height={868}
      className={`block object-contain object-left ${sizeClass[size]} ${className}`.trim()}
      decoding="async"
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {img}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{img}</span>;
}
