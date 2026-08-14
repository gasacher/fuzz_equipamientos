import type { PublishedNetworksSource } from "@/lib/published-networks";
import { PUBLISHED_NETWORK_LABELS } from "@/lib/published-networks";

type Props = {
  source: PublishedNetworksSource;
  compact?: boolean;
};

function isInstagramUrl(value: string | null | undefined) {
  if (!value?.trim()) return false;
  return /instagram\.com/i.test(value.trim());
}

export function resolveListPublishedNetworks(
  source: PublishedNetworksSource,
): PublishedNetworksSource {
  const ig = isInstagramUrl(source.ig) ? source.ig!.trim() : null;
  return {
    ig,
    fb: source.fb ?? false,
    ml: source.ml ?? false,
  };
}

export function PublishedNetworksBadges({ source, compact }: Props) {
  const resolved = resolveListPublishedNetworks(source);
  const ig = resolved.ig;
  const hasAny = !!ig || resolved.fb || resolved.ml;

  if (!hasAny) {
    return compact ? (
      <span className="text-[#9c9c9c]">—</span>
    ) : (
      <span className="text-xs text-[#9c9c9c]">—</span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {ig && (
        <a
          href={ig}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[#e50914]/40 bg-[#1a0a0a] px-2 py-0.5 text-[10px] font-medium text-[#e50914] hover:underline"
          title={ig}
        >
          {PUBLISHED_NETWORK_LABELS.instagram}
        </a>
      )}
      {resolved.fb && (
        <span className="rounded-full border border-[#7ec8e3]/40 bg-[#0f0f0f] px-2 py-0.5 text-[10px] font-medium text-[#7ec8e3]">
          {compact ? "MP" : PUBLISHED_NETWORK_LABELS.marketplace}
        </span>
      )}
      {resolved.ml && (
        <span className="rounded-full border border-[#ffb020]/40 bg-[#0f0f0f] px-2 py-0.5 text-[10px] font-medium text-[#ffb020]">
          {compact ? "ML" : PUBLISHED_NETWORK_LABELS.mercadoLibre}
        </span>
      )}
    </div>
  );
}
