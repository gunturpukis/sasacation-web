import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PartnerApplyForm } from "@/components/partner-apply-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default async function PartnerApplyPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login?redirect=/partner/apply");

  // Kalau sudah pernah apply (status apapun), langsung ke dashboard —
  // dashboard yang menampilkan status pengajuannya, bukan halaman ini lagi.
  const meRes = await fetch(`${API_BASE_URL}/partners/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (meRes.ok) redirect("/partner/dashboard");

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Jadi Mitra Sasacation</CardTitle>
          <CardDescription>
            Daftarkan properti Anda dan mulai terima booking dari wisatawan Lombok.
            Pengajuan akan ditinjau oleh admin sebelum akun mitra Anda aktif.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartnerApplyForm />
        </CardContent>
      </Card>
    </main>
  );
}
