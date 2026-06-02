"use client";

export function ImportExcelButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="btn-fuzz-outline" disabled title="Solo en la app operativa">
        Reimportar Excel
      </button>
      <span className="text-sm text-[#9c9c9c]">Disponible con login en la versión completa</span>
    </div>
  );
}
