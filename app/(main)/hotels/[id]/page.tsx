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
        <div className="relative md:col-span-2 h-80 md:h-96 bg-slate-100">
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3">
          {hotel.images.slice(1, 3).map((img, i) => (
            <div key={i} className="relative h-full bg-slate-100">
              <Image src={img} alt={`${hotel.name} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Info utama */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-1 text-slate-500 mb-2">
            <MapPin className="h-4 w-4" />
            {hotel.address}
          </div>
 
          <h1 className="text-3xl font-bold text-emerald-950 mb-3">{hotel.name}</h1>
 
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-slate-400">({hotel.reviewCount} ulasan)</span>
          </div>
 
          <p className="text-slate-600 leading-relaxed mb-8">{hotel.description}</p>
 
          <h2 className="font-semibold text-lg mb-4">Fasilitas</h2>
          <div className="grid grid-cols-2 gap-3">
            {hotel.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                {amenity}
              </div>
            ))}
          </div>
        </div>
 
        {/* Booking card */}
        <div>
          <div className="sticky top-24 border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="mb-4">
              <span className="text-2xl font-bold text-emerald-700">${hotel.price}</span>
              <span className="text-slate-400"> /malam</span>
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