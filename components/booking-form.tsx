"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel } from "@/types/hotel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
 
export function BookingForm({ hotel }: { hotel: Hotel }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const today = new Date().toISOString().split("T")[0];
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
 
    if (!checkIn || !checkOut) {
      setError("Tanggal check-in dan check-out wajib diisi");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Tanggal check-out harus setelah check-in");
      return;
    }
 
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel.id,
          checkIn,
          checkOut,
          guestCount,
          notes,
        }),
      });
 
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal membuat booking");
 
      router.push(`/booking/checkout?sessionId=${data.data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setIsLoading(false);
    }
  }
 
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
 
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="checkIn" className="mb-2 block">
            Check-in
          </Label>
          <Input
            id="checkIn"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="checkOut" className="mb-2 block">
            Check-out
          </Label>
          <Input
            id="checkOut"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
          />
        </div>
      </div>
 
      <div>
        <Label htmlFor="guestCount" className="mb-2 block">
          Jumlah Tamu
        </Label>
        <Input
          id="guestCount"
          type="number"
          min={1}
          max={10}
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          required
        />
      </div>
 
      <div>
        <Label htmlFor="notes" className="mb-2 block">
          Catatan (opsional)
        </Label>
        <Input
          id="notes"
          placeholder="Misal: minta kamar menghadap laut"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
 
      {nights > 0 && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {nights} malam × ${hotel.price} ={" "}
          <span className="font-semibold">${nights * hotel.price}</span>
          <span className="text-emerald-700"> (belum termasuk pajak & biaya layanan)</span>
        </div>
      )}
 
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
 
      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Lanjut ke Pembayaran
      </Button>
    </form>
  );
}
 