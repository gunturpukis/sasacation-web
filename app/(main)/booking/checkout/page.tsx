"use client";
 
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckoutSession, PaymentResult } from "@/types/checkout";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Calendar, Users } from "lucide-react";
import Link from "next/link";
 
export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
 
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentResult | null>(null);
 
  useEffect(() => {
    if (!sessionId) {
      setError("Session tidak ditemukan");
      setIsLoadingSession(false);
      return;
    }
 
    fetch(`/api/checkout/session/${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSession(data.data);
          if (data.data.paymentMethods?.length > 0) {
            setSelectedMethod(data.data.paymentMethods[0].id);
          }
        } else {
          setError(data.message || "Session tidak ditemukan");
        }
      })
      .catch(() => setError("Gagal memuat data checkout"))
      .finally(() => setIsLoadingSession(false));
  }, [sessionId]);
 
  async function handlePay() {
    if (!sessionId || !selectedMethod) return;
    setIsPaying(true);
    setError(null);
 
    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, paymentMethod: selectedMethod }),
      });
 
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Pembayaran gagal");
 
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsPaying(false);
    }
  }
 
  if (isLoadingSession) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </main>
    );
  }
 
  if (error && !session) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button asChild>
          <Link href="/hotels">Kembali ke Hotel</Link>
        </Button>
      </main>
    );
  }
 
  if (result) {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-emerald-950 mb-2">
          Pembayaran Berhasil!
        </h1>
        <p className="text-slate-500 mb-6">
          Booking kamu sudah dikonfirmasi. Sampai jumpa di Lombok!
        </p>
 
        <div className="rounded-xl border border-slate-100 p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Kode Booking</span>
            <span className="font-semibold">{result.booking.bookingCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Hotel</span>
            <span className="font-medium">{result.booking.hotelName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total Dibayar</span>
            <span className="font-semibold text-emerald-700">
              ${result.payment.amount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Transaksi</span>
            <span className="font-mono text-xs">{result.payment.transactionId}</span>
          </div>
        </div>
 
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/hotels">Cari Hotel Lain</Link>
          </Button>
          <Button asChild>
            <Link href="/profile">Lihat Booking Saya</Link>
          </Button>
        </div>
      </main>
    );
  }
 
  if (!session) return null;
 
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-emerald-950 mb-6">Checkout</h1>
 
      {/* Ringkasan hotel */}
      <div className="flex gap-4 mb-6 p-4 rounded-xl border border-slate-100">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
          <Image src={session.hotel.image} alt={session.hotel.name} fill className="object-cover" />
        </div>
        <div>
          <h2 className="font-semibold">{session.hotel.name}</h2>
          <p className="text-sm text-slate-500">{session.hotel.location}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(session.checkIn).toLocaleDateString("id-ID")} -{" "}
              {new Date(session.checkOut).toLocaleDateString("id-ID")}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {session.guestCount} tamu
            </span>
          </div>
        </div>
      </div>
 
      {/* Rincian harga */}
      <div className="rounded-xl border border-slate-100 p-5 mb-6 space-y-2">
        <h3 className="font-semibold mb-3">Rincian Harga</h3>
        <div className="flex justify-between text-sm text-slate-600">
          <span>
            ${session.pricing.pricePerNight} × {session.nights} malam
          </span>
          <span>${session.pricing.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Pajak ({session.pricing.taxRate}%)</span>
          <span>${session.pricing.tax}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Biaya layanan</span>
          <span>${session.pricing.serviceFee}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-slate-100">
          <span>Total</span>
          <span className="text-emerald-700">${session.pricing.total}</span>
        </div>
      </div>
 
      {/* Metode pembayaran */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Metode Pembayaran</h3>
        <div className="space-y-2">
          {session.paymentMethods.map((method) => (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="accent-emerald-600"
              />
              <span className="text-sm font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>
 
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}
 
      <Button
        onClick={handlePay}
        className="w-full"
        size="lg"
        disabled={isPaying || !selectedMethod}
      >
        {isPaying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Bayar ${session.pricing.total}
      </Button>
    </main>
  );
}
 