"use client";

import { RECEIPT_ACCEPT, validateReceiptFile } from "@/lib/receipt-file";

type Props = {
  fileName: string;
  existingUrl?: string | null;
  onChange: (patch: { receiptName: string; receiptFile: File | null; receiptError?: string }) => void;
};

export function ReceiptFileField({ fileName, existingUrl, onChange }: Props) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[#9c9c9c]">Recibo (archivo)</span>
      <input
        type="file"
        accept={RECEIPT_ACCEPT}
        className="fuzz-input cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[#e50914] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#c40812]"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) {
            onChange({ receiptName: "", receiptFile: null, receiptError: undefined });
            return;
          }
          const receiptError = validateReceiptFile(file);
          if (receiptError) {
            e.target.value = "";
            onChange({ receiptName: "", receiptFile: null, receiptError });
            return;
          }
          onChange({ receiptName: file.name, receiptFile: file, receiptError: undefined });
        }}
      />
      {fileName ? (
        <p className="text-xs text-[#6fcf97]">Adjunto: {fileName}</p>
      ) : existingUrl ? (
        <a
          href={existingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs text-[#e50914] hover:underline"
        >
          Ver recibo actual
        </a>
      ) : (
        <p className="text-xs text-[#9c9c9c]">PDF o imagen, máximo 5 MB</p>
      )}
    </label>
  );
}
