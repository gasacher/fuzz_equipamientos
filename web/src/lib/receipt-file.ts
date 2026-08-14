export const RECEIPT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export function validateReceiptFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Formato no permitido. Usá PDF, JPG, PNG o WebP.";
  }
  if (file.size > MAX_BYTES) {
    return "El archivo no puede superar 5 MB.";
  }
  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
}

export function receiptDownloadPath(instrumentId: string) {
  return `/api/instruments/${instrumentId}/receipt`;
}
