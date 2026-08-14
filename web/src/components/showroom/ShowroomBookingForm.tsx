"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShowroomSlotPicker } from "@/components/showroom/ShowroomSlotPicker";
import { buildWhatsAppConsultUrl } from "@/lib/fuzz";
import { listBookableDates } from "@/lib/showroom-schedule";
import { appPath } from "@/lib/site-path";

export function ShowroomBookingForm() {
  const searchParams = useSearchParams();
  const [visitorName, setVisitorName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [visitType, setVisitType] = useState<"general" | "interest">("general");
  const [interestNote, setInterestNote] = useState("");
  const [date, setDate] = useState(() => listBookableDates(1)[0] ?? "");
  const [hour, setHour] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interes = searchParams.get("interes")?.trim();
    if (interes) {
      setVisitType("interest");
      setInterestNote(interes);
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || hour === "") {
      setError("Elegí día y horario disponibles");
      return;
    }
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorName,
        phone,
        email: email || undefined,
        visitType,
        interestNote: visitType === "interest" ? interestNote : undefined,
        date,
        hour,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((data.error as string) ?? "No se pudo agendar la cita");
      return;
    }

    const data = (await res.json()) as { whatsappUrl?: string };
    setDone(true);

    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }

  if (done) {
    return (
      <div className="fuzz-card mx-auto max-w-lg space-y-4 p-8 text-center">
        <p className="fuzz-title text-2xl text-[#6fcf97]">¡Cita registrada!</p>
        <p className="text-sm text-[#9c9c9c]">
          Te contactaremos para confirmar. Si se abrió WhatsApp, enviá el mensaje para avisarnos al
          instante.
        </p>
        <Link href={appPath("/catalogo")} className="btn-fuzz-outline inline-block">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-5">
      <div className="fuzz-card space-y-4 p-6">
        <p className="text-sm text-[#9c9c9c]">
          Showroom en Buenos Aires ·{" "}
          <strong className="text-[#f2f2f2]">Lunes a viernes, 11 a 19 h</strong>
        </p>

        {error && <p className="text-sm text-[#e50914]">{error}</p>}

        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Nombre *</span>
          <input
            className="fuzz-input"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Teléfono / WhatsApp *</span>
          <input
            className="fuzz-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+54 11 …"
            required
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs text-[#9c9c9c]">Email (opcional)</span>
          <input
            className="fuzz-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-xs text-[#9c9c9c]">Motivo de la visita *</legend>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-3">
            <input
              type="radio"
              name="visitType"
              className="mt-1 accent-[#e50914]"
              checked={visitType === "general"}
              onChange={() => setVisitType("general")}
            />
            <span className="text-sm text-[#f2f2f2]">Visita general al showroom</span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#1c1c1c] bg-[#0f0f0f] p-3">
            <input
              type="radio"
              name="visitType"
              className="mt-1 accent-[#e50914]"
              checked={visitType === "interest"}
              onChange={() => setVisitType("interest")}
            />
            <span className="text-sm text-[#f2f2f2]">Interés en un producto específico</span>
          </label>
        </fieldset>

        {visitType === "interest" && (
          <label className="block space-y-1">
            <span className="text-xs text-[#9c9c9c]">¿Qué te interesa? *</span>
            <textarea
              className="fuzz-input"
              rows={3}
              value={interestNote}
              onChange={(e) => setInterestNote(e.target.value)}
              placeholder="Ej. Gibson Les Paul del catálogo…"
              required
            />
          </label>
        )}

        <ShowroomSlotPicker
          date={date}
          hour={hour}
          onDateChange={setDate}
          onHourChange={setHour}
        />

        {date && hour === "" && (
          <p className="text-sm text-[#9c9c9c]">
            Elegí un horario libre del calendario. Si no hay turnos,{" "}
            <a
              href={buildWhatsAppConsultUrl("agendar visita al showroom")}
              target="_blank"
              rel="noreferrer"
              className="text-[#e50914] hover:underline"
            >
              escribinos por WhatsApp
            </a>
            .
          </p>
        )}
      </div>

      <button type="submit" className="btn-fuzz w-full" disabled={submitting || hour === ""}>
        {submitting ? "Agendando…" : "Agendar visita"}
      </button>
      <p className="text-center text-xs text-[#9c9c9c]">
        Los horarios marcados como ocupados ya están reservados. Al confirmar se abre WhatsApp para
        avisarnos.
      </p>
    </form>
  );
}
