"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  StoredCheckoutData,
  CheckoutPaymentInitiated,
  PaymentStatusResult,
} from "@/types/checkout";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Calendar, Users, ExternalLink, XCircle } from "lucide-react";
import Link from "next/link";

// Polling: cek status tiap 3 detik, maksimal 2 menit — webhook Midtrans
// biasanya masuk dalam hitungan detik setelah user selesai bayar di Snap,
// tapi kasih ruang toleransi untuk jaringan lambat.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

type Phase = "form" | "paying" | "awaiting" | "success" | "failed" | "error";

export default function CheckoutPage() {
  const [session, setSession] = useState<StoredCheckoutData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentStatusResult | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX: sebelumnya halaman ini fetch ke /api/checkout/session/:sessionId
  // yang TIDAK PERNAH ADA di backend (backend stateless, tidak menyimpan
  // session) — makanya selalu 404. Sekarang baca dari sessionStorage yang
  // diisi oleh booking-form.tsx.
  //
  // useEffect sengaja dipakai di sini (bukan lazy useState initializer)
  // karena sessionStorage tidak ada saat SSR — initializer yang membaca
  // sessionStorage langsung akan crash di server ATAU menyebabkan hydration
  // mismatch (render server vs client-pertama beda). useEffect menjamin ini
  // hanya jalan di client SETELAH hydration selesai, jadi aman.
  useEffect(() => {
    const raw = sessionStorage.getItem("checkoutData");
    if (!raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- lihat penjelasan di atas useEffect ini
      setPhase("error");
      setError("Sesi checkout tidak ditemukan. Silakan mulai lagi dari halaman hotel.");
      return;
    }
    try {
      const parsed: StoredCheckoutData = JSON.parse(raw);
      setSession(parsed);
      setSelectedMethod(parsed.paymentMethods?.[0]?.id ?? "");
    } catch {
      setPhase("error");
      setError("Gagal memuat data checkout.");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  async function handlePay() {
    if (!session || !selectedMethod) return;
    setPhase("paying");
    setError(null);

    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: session.hotelId,
          checkIn: session.checkIn,
          checkOut: session.checkOut,
          guestCount: session.guestCount,
          notes: session.notes,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Pembayaran gagal");

      const initiated: CheckoutPaymentInitiated = data.data;
      setRedirectUrl(initiated.redirectUrl);
      setPhase("awaiting");

      // Buka halaman Snap Midtrans di tab baru — user tetap di tab ini untuk
      // melihat status polling.
      window.open(initiated.redirectUrl, "_blank", "noopener,noreferrer");

      pollPaymentStatus(initiated.payment.transactionId, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setPhase("form");
    }
  }

  function pollPaymentStatus(transactionId: string, attempt: number) {
    if (attempt >= MAX_POLL_ATTEMPTS) {
      setError(
        'Belum ada konfirmasi pembayaran. Kalau Anda sudah membayar, cek status booking di halaman "Booking Saya" dalam beberapa saat.'
      );
      setPhase("error");
      return;
    }

    pollTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/checkout/status/${transactionId}`);
        const data = await res.json();

        if (res.ok && data.success) {
          const statusResult: PaymentStatusResult = data.data;
          if (statusResult.payment.status === "success") {
            sessionStorage.removeItem("checkoutData");
            setResult(statusResult);
            setPhase("success");
            return;
          }
          if (statusResult.payment.status === "failed") {
            setError("Pembayaran gagal atau dibatalkan. Silakan coba lagi.");
            setPhase("failed");
            return;
          }
        }
        // status masih 'pending' (atau request gagal sesaat) -> lanjut polling
        pollPaymentStatus(transactionId, attempt + 1);
      } catch {
        pollPaymentStatus(transactionId, attempt + 1);
      }
    }, POLL_INTERVAL_MS);
  }

  if (phase === "error" && !session) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="text-[var(--destructive)] mb-4">{error}</p>
        <Button asChild>
          <Link href="/hotels">Kembali ke Hotel</Link>
        </Button>
      </main>
    );
  }

  if (phase === "awaiting") {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--primary)] mx-auto mb-6" />
        <h1 className="text-xl font-semibold text-[var(--foreground)] mb-2">Menunggu Pembayaran...</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          Halaman pembayaran sudah dibuka di tab baru. Selesaikan pembayaran Anda, lalu kembali
          ke sini — status akan terupdate otomatis.
        </p>
        {redirectUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(redirectUrl, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-4 w-4" />
            Buka Lagi Halaman Pembayaran
          </Button>
        )}
      </main>
    );
  }

  if (phase === "failed" || (phase === "error" && session)) {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <XCircle className="h-14 w-14 text-[var(--destructive)] mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          {phase === "failed" ? "Pembayaran Gagal" : "Belum Ada Konfirmasi"}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => setPhase("form")}>
            Coba Lagi
          </Button>
          <Button asChild>
            <Link href="/profile">Cek Booking Saya</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (phase === "success" && result) {
    return (
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-[var(--primary)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
          Pembayaran Berhasil!
        </h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          Booking kamu sudah dikonfirmasi. Sampai jumpa di Lombok!
        </p>

        <div className="rounded-xl border border-[var(--border)] p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Kode Booking</span>
            <span className="font-semibold">{result.booking.bookingCode}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Hotel</span>
            <span className="font-medium">{result.booking.hotelName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Total Dibayar</span>
            <span className="font-semibold text-[var(--primary)]">
              ${result.payment.amount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Transaksi</span>
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
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Checkout</h1>

      {/* Ringkasan hotel */}
      <div className="flex gap-4 mb-6 p-4 rounded-xl border border-[var(--border)]">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[var(--muted)]">
          <Image src={session.hotel.image} alt={session.hotel.name} fill className="object-cover" />
        </div>
        <div>
          <h2 className="font-semibold">{session.hotel.name}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{session.hotel.location}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
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
      <div className="rounded-xl border border-[var(--border)] p-5 mb-6 space-y-2">
        <h3 className="font-semibold mb-3">Rincian Harga</h3>
        <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
          <span>
            ${session.pricing.pricePerNight} × {session.nights} malam
          </span>
          <span>${session.pricing.subtotal}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
          <span>Pajak ({session.pricing.taxRate}%)</span>
          <span>${session.pricing.tax}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
          <span>Biaya layanan</span>
          <span>${session.pricing.serviceFee}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-[var(--border)]">
          <span>Total</span>
          <span className="text-[var(--primary)]">${session.pricing.total}</span>
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
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:border-[var(--muted-foreground)]/40"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="accent-[var(--accent)]"
              />
              <span className="text-sm font-medium">{method.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--destructive)] bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <Button
        onClick={handlePay}
        className="w-full"
        size="lg"
        disabled={phase === "paying" || !selectedMethod}
      >
        {phase === "paying" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Bayar ${session.pricing.total}
      </Button>
    </main>
  );
}
