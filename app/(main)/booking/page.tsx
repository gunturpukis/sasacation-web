import { notFound } from "next/navigation";
import { getHotelById } from "@/lib/hotel/lib_hotel";
import { BookingForm } from "@/components/booking-form";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
 
export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ hotelId?: string }>;
}) {
  const { hotelId } = await searchParams;
 
  if (!hotelId) {
    notFound();
  }
 
  let hotel;
  try {
    const res = await getHotelById(hotelId);
    hotel = res.data;
  } catch {
    notFound();
  }
 
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold text-emerald-950 mb-6">
        Lengkapi Detail Booking
      </h1>
 
      <div className="flex gap-4 mb-8 p-4 rounded-xl border border-slate-100">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
          <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{hotel.name}</h2>
          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {hotel.location}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
      </div>
 
      <BookingForm hotel={hotel} />
    </main>
  );
}
 