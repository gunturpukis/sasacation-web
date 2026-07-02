import Image from "next/image";
import { notFound } from "next/navigation";
import { getHotelById } from "@/lib/hotel/lib_hotel";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Check } from "lucide-react";
 
export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
 
  let hotel;
  try {
    const res = await getHotelById(id);
    hotel = res.data;
  } catch {
    notFound();
  }
 
  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {/* Gambar utama + galeri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-xl overflow-hidden">
        <div className="relative md:col-span-2 h-80 md:h-96 bg-[var(--muted)]">
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3">
          {hotel.images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative h-full bg-[var(--muted)]">
              <Image src={img} alt={`${hotel.name} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Info utama */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 text-[var(--muted-foreground)] mb-2">
            <MapPin className="h-4 w-4" />
            {hotel.address}
          </div>
 
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">{hotel.name}</h1>
 
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)]" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-[var(--muted-foreground)]">({hotel.reviewCount} ulasan)</span>
          </div>
 
          <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">{hotel.description}</p>
 
          <h2 className="font-semibold text-lg mb-4">Fasilitas</h2>
          <div className="grid grid-cols-2 gap-3">
            {hotel.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Check className="h-4 w-4 text-[var(--primary)] shrink-0" />
                {amenity}
              </div>
            ))}
          </div>
        </div>
 
        {/* Booking card */}
        <div>
          <div className="sticky top-24 border border-[var(--border)] rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <span className="text-2xl font-bold text-[var(--primary)]">${hotel.price}</span>
              <span className="text-[var(--muted-foreground)]"> /malam</span>
            </div>
 
            {hotel.available ? (
              <Button className="w-full" size="lg" asChild>
                <a href={`/booking?hotelId=${hotel.id}`}>Pesan Sekarang</a>
              </Button>
            ) : (
              <Button className="w-full" size="lg" disabled>
                Tidak Tersedia
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}