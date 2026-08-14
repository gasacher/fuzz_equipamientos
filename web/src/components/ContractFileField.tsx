import { RECEIPT_ACCEPT } from "@/lib/receipt-file";

type Props = {
  fileName?: string | null;
  existingUrl?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
};

export function ContractFileField({ fileName, existingUrl, onChange, error }: Props) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-[#9c9c9c]">Archivo del contrato</span>
      <input
        type="file"
        name="file"
        accept={RECEIPT_ACCEPT}
        className="fuzz-input cursor-pointer file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[#e50914] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
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
          Ver contrato actual
        </a>
      ) : (
        <p className="text-xs text-[#9c9c9c]">PDF o imagen, máximo 5 MB (opcional)</p>
      )}
      {error && <p className="text-xs text-[#e50914]">{error}</p>}
    </label>
  );
}
