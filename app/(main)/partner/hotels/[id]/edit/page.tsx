import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { HotelForm } from "@/components/hotel-form";
import { PartnerHotel } from "@/types/partner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect(`/login?redirect=/partner/hotels/${id}/edit`);

  // Endpoint publik (GET /hotels/:id) dipakai untuk prefill data — otorisasi
  // kepemilikan tetap dicek di backend saat submit (PUT /hotels/:id).
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) redirect("/partner/hotels");

  const data = await res.json();
  const hotel: PartnerHotel = data.data;

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/partner/hotels"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Hotel Saya
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Ubah Hotel</CardTitle>
          <CardDescription>Perbarui detail {hotel.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <HotelForm hotel={hotel} />
        </CardContent>
      </Card>
    </main>
  );
}
