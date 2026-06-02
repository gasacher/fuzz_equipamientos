/** Número WhatsApp FUZZ (solo dígitos, con código país AR). Configurá en .env */
export function getWhatsAppNumber() {
  const raw = process.env.FUZZ_WHATSAPP ?? "5491112345678";
  return raw.replace(/\D/g, "");
}

export function buildWhatsAppConsultUrl(titulo: string, precio?: string) {
  const detalle = precio ? `${titulo} (${precio})` : titulo;
  const text = encodeURIComponent(`Hola FUZZ! Me interesa comprar: ${detalle}`);
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}
