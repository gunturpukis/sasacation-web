import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PartnerHotel } from "@/types/partner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteHotelButton } from "@/components/delete-hotel-button";
import { Plus, ArrowLeft, ImageOff } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default async function PartnerHotelsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login?redirect=/partner/hotels");

  const res = await fetch(`${API_BASE_URL}/hotels/my`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 403) redirect("/partner/dashboard");
  if (!res.ok) redirect("/login");

  const data = await res.json();
  const hotels: PartnerHotel[] = data.data || [];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/partner/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard Mitra
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading text-[var(--foreground)] mb-1">Hotel Saya</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{hotels.length} hotel terdaftar</p>
        </div>
        <Button className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85" asChild>
          <Link href="/partner/hotels/new">
            <Plus className="h-4 w-4" />
            Tambah Hotel
          </Link>
        </Button>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-[var(--border)]">
          <p className="text-[var(--muted-foreground)] mb-4">Belum ada hotel yang terdaftar.</p>
          <Button className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85" asChild>
            <Link href="/partner/hotels/new">Tambah Hotel Pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4"
            >
              <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-[var(--muted)]">
                {hotel.image ? (
                  // Pakai <img> biasa (bukan next/image) karena URL gambar
                  // diinput bebas oleh mitra — bisa dari domain manapun,
                  // sementara next/image butuh domain terdaftar di
                  // next.config.ts (remotePatterns), yang cuma whitelist
                  // images.unsplash.com saat ini.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hotel.image} alt={hotel.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[var(--muted-foreground)]">
                    <ImageOff className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-[var(--foreground)] truncate">{hotel.name}</h3>
                  <Badge variant={hotel.available ? "success" : "secondary"}>
                    {hotel.available ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] truncate">{hotel.location}</p>
                <p className="text-sm font-medium text-[var(--primary)]">${hotel.price}/malam</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/partner/hotels/${hotel.id}/edit`}>Ubah</Link>
                </Button>
                {hotel.available && <DeleteHotelButton hotelId={hotel.id} hotelName={hotel.name} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
