import "server-only";

import {
  buildAppointmentMessageBody,
  type AppointmentNotifyPayload,
} from "@/lib/appointment-message";

export async function sendAppointmentEmail(payload: AppointmentNotifyPayload): Promise<boolean> {
  const to = process.env.APPOINTMENT_NOTIFY_EMAIL ?? "fuzzequipamientos@gmail.com";
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const subject = `Nueva cita showroom — ${payload.visitorName}`;
  const body = buildAppointmentMessageBody(payload);

  if (!host || !user || !pass) {
    console.info("[appointment-email:skipped]", { to, subject, body });
    return false;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? user,
      to,
      subject,
      text: body,
    });
    return true;
  } catch (error) {
    console.error("[appointment-email:error]", error);
    return false;
  }
}
