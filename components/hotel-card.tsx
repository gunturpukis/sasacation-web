import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Hotel } from "@/types/hotel";
 
export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Link
      href={`/hotels/${hotel.id}`}
      className="group block rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)] hover:shadow-lg transition-shadow"
      style={{ borderTop: "3px solid var(--accent)" }}
    >
      <div className="relative h-48 w-full overflow-hidden bg-[var(--muted)]">
       <Image
            src={hotel.image}
            alt={hotel.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hotel.featured && (
          <span className="absolute top-3 left-3 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
 
      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] mb-1">
          <MapPin className="h-3.5 w-3.5" />
          {hotel.location}
        </div>
 
        <h3 className="font-heading text-lg text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
          {hotel.name}
        </h3>
 
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
            <span className="text-sm font-medium">{hotel.rating}</span>
            <span className="text-sm text-[var(--muted-foreground)]">({hotel.reviewCount})</span>
          </div>
 
          <div className="text-right">
            <span className="font-heading text-lg text-[var(--primary)]">${hotel.price}</span>
            <span className="text-sm text-[var(--muted-foreground)]"> /malam</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
