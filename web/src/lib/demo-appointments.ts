import {
  buildScheduledAt,
  dateKeyFromScheduledAt,
  hourInShowroom,
  listBookableDates,
} from "@/lib/showroom-schedule";

const KEY = "fuzz-demo-appointments";

export type DemoAppointment = {
  id: string;
  visitorName: string;
  phone: string;
  email: string | null;
  visitType: string;
  interestNote: string | null;
  scheduledAt: string;
  status: string;
  createdAt: string;
};

function buildSeed(): DemoAppointment[] {
  const dates = listBookableDates(5);
  const first = dates[1] ?? dates[0];
  const second = dates[3] ?? dates[2] ?? first;
  if (!first) return [];

  const now = new Date().toISOString();
  return [
    {
      id: "apt-demo-lucia",
      visitorName: "Lucía Méndez",
      phone: "+54 11 6000-1122",
      email: "lucia@email.com",
      visitType: "general",
      interestNote: null,
      scheduledAt: buildScheduledAt(first, 12).toISOString(),
      status: "pending",
      createdAt: now,
    },
    {
      id: "apt-demo-martin",
      visitorName: "Martín Pérez",
      phone: "+54 11 6111-3344",
      email: null,
      visitType: "interest",
      interestNote: "Gibson Les Paul del catálogo",
      scheduledAt: buildScheduledAt(first, 16).toISOString(),
      status: "confirmed",
      createdAt: now,
    },
    ...(second
      ? [
          {
            id: "apt-demo-sofia",
            visitorName: "Sofía Rivas",
            phone: "+54 11 6222-7788",
            email: "sofia.rivas@email.com",
            visitType: "general",
            interestNote: null,
            scheduledAt: buildScheduledAt(second, 11).toISOString(),
            status: "pending",
            createdAt: now,
          } satisfies DemoAppointment,
        ]
      : []),
  ];
}

function readAppointments(): DemoAppointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const seed = buildSeed();
      writeAppointments(seed);
      return seed;
    }
    return JSON.parse(raw) as DemoAppointment[];
  } catch {
    return buildSeed();
  }
}

function writeAppointments(items: DemoAppointment[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getDemoAppointments(): DemoAppointment[] {
  return readAppointments().sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );
}

export function getDemoBookedHours(dateStr: string): number[] {
  return getDemoAppointments()
    .filter((row) => row.status !== "cancelled")
    .filter((row) => dateKeyFromScheduledAt(new Date(row.scheduledAt)) === dateStr)
    .map((row) => hourInShowroom(new Date(row.scheduledAt)));
}

export function addDemoAppointment(row: DemoAppointment) {
  writeAppointments([row, ...readAppointments()]);
}

export function updateDemoAppointmentStatus(id: string, status: string): DemoAppointment[] {
  const next = readAppointments().map((row) => (row.id === id ? { ...row, status } : row));
  writeAppointments(next);
  return next.sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );
}

export function countDemoAppointmentsPending() {
  return getDemoAppointments().filter((row) => row.status === "pending").length;
}

export function newDemoAppointmentId() {
  return `apt-demo-${Date.now()}`;
}
