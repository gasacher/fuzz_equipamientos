import type { PublishedNetworksSource } from "@/lib/published-networks";
import { PUBLISHED_NETWORK_LABELS } from "@/lib/published-networks";

type Props = {
  source: PublishedNetworksSource;
};

export function PublishedNetworksDisplay({ source }: Props) {
  const ig = source.ig?.trim();
  const hasAny = !!ig || source.fb || source.ml;

  if (!hasAny) {
    return <p className="mt-1 text-sm text-[#9c9c9c]">Sin redes indicadas</p>;
  }

  return (
    <ul className="mt-2 space-y-2 text-sm">
      {ig && (
        <li className="flex flex-wrap items-center gap-2 text-[#f2f2f2]">
          <span className="rounded-full border border-[#e50914]/40 bg-[#1a0a0a] px-2.5 py-0.5 text-xs text-[#e50914]">
            {PUBLISHED_NETWORK_LABELS.instagram}
          </span>
          <a
            href={ig}
            target="_blank"
            rel="noreferrer"
            className="break-all text-[#e50914] hover:underline"
          >
            {ig}
          </a>
        </li>
      )}
      {source.fb && (
        <li>
          <span className="rounded-full border border-[#7ec8e3]/40 bg-[#0f0f0f] px-2.5 py-0.5 text-xs text-[#7ec8e3]">
            {PUBLISHED_NETWORK_LABELS.marketplace}
          </span>
        </li>
      )}
      {source.ml && (
        <li>
          <span className="rounded-full border border-[#ffb020]/40 bg-[#0f0f0f] px-2.5 py-0.5 text-xs text-[#ffb020]">
            {PUBLISHED_NETWORK_LABELS.mercadoLibre}
          </span>
        </li>
      )}
    </ul>
  );
}
