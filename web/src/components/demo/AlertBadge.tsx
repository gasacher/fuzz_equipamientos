const styles: Record<string, string> = {
  critical: "border-[#e50914]/50 bg-[#1a0a0a] text-[#e50914]",
  warning: "border-[#ffb020]/50 bg-[#1a1200] text-[#ffb020]",
  info: "border-[#333] bg-[#111] text-[#9c9c9c]",
};

const labels: Record<string, string> = {
  critical: "Crítico",
  warning: "Atención",
  info: "Info",
};

export function AlertBadge({ level }: { level: keyof typeof styles }) {
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}
