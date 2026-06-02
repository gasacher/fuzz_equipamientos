import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FUZZ",
  description: "Catálogo de equipamiento y administración interna",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
