/** PDF mínimo (texto) para el demo de contratos en GitHub Pages. */

function toPdfSafe(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export function buildContractPdfBlob(lines: string[]): Blob {
  const ops = lines
    .slice(0, 18)
    .map((line, index) => {
      const y = 800 - index * 22;
      return `BT /F1 14 Tf 50 ${y} Td (${toPdfSafe(line)}) Tj ET`;
    })
    .join("\n");
  const stream = `${ops}\n`;
  const encoder = new TextEncoder();
  const parts = [
    "%PDF-1.4\n",
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${encoder.encode(stream).byteLength} >>\nstream\n${stream}endstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  const offsets = [0];
  let body = parts[0];
  for (let i = 1; i < parts.length; i += 1) {
    offsets.push(encoder.encode(body).byteLength);
    body += parts[i];
  }
  const xrefStart = encoder.encode(body).byteLength;
  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= 5; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `${xref}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return new Blob([body], { type: "application/pdf" });
}

export function openContractPdf(args: {
  fileUrl?: string | null;
  title: string;
  type: string;
  signedAt: string;
  clientName: string;
}) {
  if (args.fileUrl) {
    window.open(args.fileUrl, "_blank", "noopener,noreferrer");
    return;
  }
  const blob = buildContractPdfBlob([
    "FUZZ EQUIPAMIENTOS",
    "Contrato",
    "",
    `Cliente: ${args.clientName}`,
    `Titulo: ${args.title}`,
    `Tipo: ${args.type}`,
    `Fecha: ${args.signedAt}`,
  ]);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}
