export const SHOWROOM_TIMEZONE = "America/Argentina/Buenos_Aires";
export const SHOWROOM_SLOT_HOURS = [11, 12, 13, 14, 15, 16, 17, 18] as const;
export const SHOWROOM_MAX_DAYS_AHEAD = 28;

export const VISIT_TYPES = {
  general: "Visita general al showroom",
  interest: "Interés en un producto específico",
} as const;

export type VisitType = keyof typeof VISIT_TYPES;

export const APPOINTMENT_STATUSES = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
} as const;

export function parseDateOnly(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return new Date(`${dateStr}T12:00:00-03:00`);
}

export function isWeekday(date: Date): boolean {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: SHOWROOM_TIMEZONE,
  }).format(date);
  return !["Sat", "Sun"].includes(weekday);
}

export function todayInShowroom(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHOWROOM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isBookableDate(dateStr: string): boolean {
  const date = parseDateOnly(dateStr);
  if (!date) return false;
  if (!isWeekday(date)) return false;

  const today = parseDateOnly(todayInShowroom());
  if (!today || date < today) return false;

  const max = new Date(today);
  max.setDate(max.getDate() + SHOWROOM_MAX_DAYS_AHEAD);
  return date <= max;
}

export function buildScheduledAt(dateStr: string, hour: number): Date {
  return new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00-03:00`);
}

export function hourInShowroom(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: SHOWROOM_TIMEZONE,
    }).format(date),
  );
}

export function formatSlotLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00 – ${String(hour + 1).padStart(2, "0")}:00`;
}

export function formatAppointmentDateTime(date: Date): string {
  return date.toLocaleString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: SHOWROOM_TIMEZONE,
  });
}

export function dayRangeInShowroom(dateStr: string): { start: Date; end: Date } {
  return {
    start: new Date(`${dateStr}T00:00:00-03:00`),
    end: new Date(`${dateStr}T23:59:59-03:00`),
  };
}

export function isSlotInPast(dateStr: string, hour: number): boolean {
  const slot = buildScheduledAt(dateStr, hour);
  return slot.getTime() <= Date.now();
}

export function availableSlotsForDate(
  dateStr: string,
  bookedHours: number[],
): number[] {
  if (!isBookableDate(dateStr)) return [];
  const booked = new Set(bookedHours);
  return SHOWROOM_SLOT_HOURS.filter(
    (hour) => !booked.has(hour) && !isSlotInPast(dateStr, hour),
  );
}

export function formatDateInShowroom(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SHOWROOM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function addDaysToDateStr(dateStr: string, days: number): string {
  const d = parseDateOnly(dateStr);
  if (!d) return dateStr;
  d.setDate(d.getDate() + days);
  return formatDateInShowroom(d);
}

/** Próximos días hábiles reservables (máx. SHOWROOM_MAX_DAYS_AHEAD). */
export function listBookableDates(limit = 14): string[] {
  const dates: string[] = [];
  let cursor = todayInShowroom();
  const last = addDaysToDateStr(todayInShowroom(), SHOWROOM_MAX_DAYS_AHEAD);

  while (dates.length < limit && cursor <= last) {
    if (isBookableDate(cursor)) dates.push(cursor);
    cursor = addDaysToDateStr(cursor, 1);
  }
  return dates;
}

export function formatDateShort(dateStr: string): string {
  const d = parseDateOnly(dateStr);
  if (!d) return dateStr;
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: SHOWROOM_TIMEZONE,
  });
}

export function dateKeyFromScheduledAt(date: Date): string {
  return formatDateInShowroom(date);
}

export function startOfWeekMonday(dateStr: string): string {
  const d = parseDateOnly(dateStr);
  if (!d) return dateStr;
  const weekday = d.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: SHOWROOM_TIMEZONE,
  });
  const offsets: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const offset = offsets[weekday] ?? 0;
  d.setDate(d.getDate() - offset);
  return formatDateInShowroom(d);
}

export function weekdaysFromMonday(weekStart: string): string[] {
  const days: string[] = [];
  for (let i = 0; i < 5; i += 1) {
    days.push(addDaysToDateStr(weekStart, i));
  }
  return days;
}
