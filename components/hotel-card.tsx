import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Hotel } from "@/types/hotel";
 
export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group block rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
       <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hotel.featured && (
          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
 
      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-1">
          <MapPin className="h-3.5 w-3.5" />
          {hotel.location}
        </div>
 
        <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {hotel.name}
        </h3>
 
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{hotel.rating}</span>
            <span className="text-sm text-slate-400">({hotel.reviewCount})</span>
          </div>
 
          <div className="text-right">
            <span className="font-bold text-emerald-700">${hotel.price}</span>
            <span className="text-sm text-slate-400"> /malam</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
 