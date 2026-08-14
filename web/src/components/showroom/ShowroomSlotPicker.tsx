"use client";

import { useEffect, useState } from "react";
import {
  SHOWROOM_SLOT_HOURS,
  formatDateShort,
  formatSlotLabel,
  isSlotInPast,
  listBookableDates,
  todayInShowroom,
} from "@/lib/showroom-schedule";

type Props = {
  date: string;
  hour: number | "";
  onDateChange: (date: string) => void;
  onHourChange: (hour: number | "") => void;
};

export function ShowroomSlotPicker({ date, hour, onDateChange, onHourChange }: Props) {
  const bookableDays = listBookableDates(14);
  const [bookedHours, setBookedHours] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) {
      setBookedHours([]);
      return;
    }
    setLoading(true);
    fetch(`/api/appointments/slots?date=${encodeURIComponent(date)}`)
      .then((r) => r.json())
      .then((data: { bookedHours?: number[] }) => {
        setBookedHours(data.bookedHours ?? []);
      })
      .catch(() => setBookedHours([]))
      .finally(() => setLoading(false));
  }, [date]);

  const availableHours = SHOWROOM_SLOT_HOURS.filter((h) => !bookedHours.includes(h));

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs text-[#9c9c9c]">Elegí día *</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {bookableDays.map((day) => {
            const selected = day === date;
            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  onDateChange(day);
                  onHourChange("");
                }}
                className={`shrink-0 rounded-lg border px-3 py-2 text-left text-xs transition ${
                  selected
                    ? "border-[#e50914] bg-[#1a0a0a] text-white"
                    : "border-[#1c1c1c] bg-[#0f0f0f] text-[#9c9c9c] hover:border-[#333]"
                }`}
              >
                <span className="block capitalize">{formatDateShort(day)}</span>
                {day === todayInShowroom() && (
                  <span className="text-[10px] text-[#e50914]">Hoy</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs text-[#9c9c9c]">Elegí horario * (lun–vie, 11 a 19 h)</p>
        {loading ? (
          <p className="text-sm text-[#9c9c9c]">Cargando disponibilidad…</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SHOWROOM_SLOT_HOURS.map((slotHour) => {
              const occupied = bookedHours.includes(slotHour) || isSlotInPast(date, slotHour);
              const selected = hour === slotHour;
              return (
                <button
                  key={slotHour}
                  type="button"
                  disabled={occupied}
                  onClick={() => onHourChange(slotHour)}
                  className={`rounded-lg border px-2 py-3 text-sm transition ${
                    occupied
                      ? "cursor-not-allowed border-[#333] bg-[#0a0a0a] text-[#555] line-through"
                      : selected
                        ? "border-[#e50914] bg-[#1a0a0a] text-white"
                        : "border-[#1c1c1c] bg-[#111] text-[#f2f2f2] hover:border-[#6fcf97]"
                  }`}
                >
                  {formatSlotLabel(slotHour)}
                  {occupied && (
                    <span className="mt-1 block text-[10px] no-underline">Ocupado</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
        {!loading && date && availableHours.length === 0 && (
          <p className="mt-2 text-sm text-[#ffb020]">Este día no tiene horarios libres.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-[10px] text-[#9c9c9c]">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-[#6fcf97]" /> Libre
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-[#333] bg-[#0a0a0a]" /> Ocupado
        </span>
      </div>
    </div>
  );
}
