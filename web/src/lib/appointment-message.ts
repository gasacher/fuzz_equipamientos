import { getWhatsAppNumber } from "@/lib/fuzz";
import {
  VISIT_TYPES,
  formatAppointmentDateTime,
  type VisitType,
} from "@/lib/showroom-schedule";

export type AppointmentNotifyPayload = {
  visitorName: string;
  phone: string;
  email?: string | null;
  visitType: VisitType;
  interestNote?: string | null;
  scheduledAt: Date;
};

export function buildAppointmentMessageBody(payload: AppointmentNotifyPayload): string {
  const lines = [
    "Hola FUZZ! Quiero agendar una visita al showroom.",
    "",
    `Nombre: ${payload.visitorName}`,
    `Teléfono: ${payload.phone}`,
  ];
  if (payload.email?.trim()) lines.push(`Email: ${payload.email.trim()}`);
  lines.push(`Fecha y hora: ${formatAppointmentDateTime(payload.scheduledAt)}`);
  lines.push(`Tipo: ${VISIT_TYPES[payload.visitType]}`);
  if (payload.visitType === "interest" && payload.interestNote?.trim()) {
    lines.push(`Interés: ${payload.interestNote.trim()}`);
  }
  return lines.join("\n");
}

export function buildVisitorWhatsAppUrl(payload: AppointmentNotifyPayload): string {
  const text = encodeURIComponent(buildAppointmentMessageBody(payload));
  return `https://wa.me/${getWhatsAppNumber()}?text=${text}`;
}

export function buildAdminContactVisitorUrl(payload: AppointmentNotifyPayload): string {
  const phone = payload.phone.replace(/\D/g, "");
  const text = encodeURIComponent(
    `Hola ${payload.visitorName}! Te confirmamos tu visita al showroom FUZZ el ${formatAppointmentDateTime(payload.scheduledAt)}.`,
  );
  return `https://wa.me/${phone}?text=${text}`;
}
