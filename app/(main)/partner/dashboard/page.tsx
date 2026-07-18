import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Property } from "@/types/partner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Clock, XCircle, CheckCircle2, Hotel } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const statusMeta: Record<
  Property["status"],
  { label: string; variant: "warning" | "success" | "destructive" | "secondary"; icon: React.ElementType }
> = {
  pending: { label: "Menunggu Verifikasi", variant: "warning", icon: Clock },
  verified: { label: "Terverifikasi", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Ditolak", variant: "destructive", icon: XCircle },
  suspended: { label: "Ditangguhkan", variant: "destructive", icon: XCircle },
};

export default async function PartnerDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login?redirect=/partner/dashboard");

  const meRes = await fetch(`${API_BASE_URL}/partners/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  // Belum pernah apply sama sekali -> arahkan ke form pengajuan.
  if (meRes.status === 404) redirect("/partner/apply");
  if (!meRes.ok) redirect("/login");

  const meData = await meRes.json();
  const property: Property = meData.data;
  const meta = statusMeta[property.status];
  const StatusIcon = meta.icon;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-heading text-[var(--foreground)] mb-1">Dashboard Mitra</h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">
        Kelola properti dan hotel Anda di Sasacation.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{property.business_name}</CardTitle>
                <CardDescription>{property.address}</CardDescription>
              </div>
            </div>
            <Badge variant={meta.variant} className="shrink-0">
              <StatusIcon className="h-3 w-3" />
              {meta.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {property.status === "pending" && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Pengajuan Anda sedang ditinjau oleh tim Sasacation. Proses ini biasanya memakan waktu 1-2 hari kerja.
            </p>
          )}
          {property.status === "rejected" && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Pengajuan Anda ditolak.
              {property.rejection_reason && (
                <>
                  {" "}Alasan: <span className="text-[var(--foreground)]">{property.rejection_reason}</span>
                </>
              )}
              {" "}Silakan hubungi tim Sasacation untuk informasi lebih lanjut.
            </p>
          )}
          {property.status === "suspended" && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Akun mitra Anda sedang ditangguhkan. Silakan hubungi tim Sasacation.
            </p>
          )}
          {property.status === "verified" && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Properti Anda aktif. Anda bisa mulai menambahkan hotel untuk mulai menerima booking.
            </p>
          )}
        </CardContent>
      </Card>

      {property.status === "verified" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hotel className="h-5 w-5 text-[var(--primary)]" />
                <CardTitle>Hotel Saya</CardTitle>
              </div>
              <Button size="sm" className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85" asChild>
                <Link href="/partner/hotels">Kelola Hotel</Link>
              </Button>
            </div>
            <CardDescription>Tambah, ubah, atau nonaktifkan listing hotel Anda.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </main>
  );
}
