import Link from "next/link";

const LOGO_SRC = "/assets/img/logo-fuzz.png";

type Props = {
  /** Barra superior (web + admin) */
  size?: "bar" | "login";
  href?: string;
  className?: string;
};

const sizeClass = {
  bar: "h-14 w-auto sm:h-16 md:h-[4.5rem]",
  login: "h-16 w-auto md:h-20",
} as const;

export function FuzzLogo({ size = "bar", href, className = "" }: Props) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="FUZZ Equipamientos"
      width={1024}
      height={1024}
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
