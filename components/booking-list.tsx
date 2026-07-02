"use client";
 
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BookingWithHotel } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Loader2 } from "lucide-react";
 
const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-slate-50 text-slate-700 border-slate-200",
};
 
const STATUS_LABELS: Record<string, string> = {
  confirmed: "Terkonfirmasi",
  cancelled: "Dibatalkan",
  completed: "Selesai",
};
 
export function BookingList({ bookings }: { bookings: BookingWithHotel[] }) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
 
  async function handleCancel(id: string) {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
 
    setCancellingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membatalkan booking");
    } finally {
      setCancellingId(null);
    }
  }
 
  if (bookings.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">
        Belum ada booking. Yuk mulai jelajahi Lombok!
      </p>
    );
  }
 
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100"
        >
          <div className="relative w-full sm:w-32 h-32 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
            <Image
              src={booking.hotelImage}
              alt={booking.hotelName}
              fill
              className="object-cover"
            />
          </div>
 
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold">{booking.hotelName}</h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full border shrink-0 ${
                  STATUS_STYLES[booking.status] || ""
                }`}
              >
                {STATUS_LABELS[booking.status] || booking.status}
              </span>
            </div>
 
            <p className="text-sm text-slate-500 mb-2">{booking.hotelLocation}</p>
 
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(booking.checkIn).toLocaleDateString("id-ID")} -{" "}
                {new Date(booking.checkOut).toLocaleDateString("id-ID")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {booking.guestCount} tamu
              </span>
            </div>
 
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {booking.bookingCode}
              </span>
              <span className="font-semibold text-emerald-700">
                ${booking.totalPrice}
              </span>
            </div>
 
            {booking.status === "confirmed" && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => handleCancel(booking.id)}
                disabled={cancellingId === booking.id}
              >
                {cancellingId === booking.id && (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                )}
                Batalkan Booking
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}