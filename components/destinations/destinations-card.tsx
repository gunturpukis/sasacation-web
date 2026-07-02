import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Destination } from "@/types/destinations";
 
export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.id}`}
      className="group block rounded-xl overflow-hidden border border-[var(--border)] hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48 w-full overflow-hidden bg-[var(--muted)]">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-[var(--card)]/90 backdrop-blur text-[var(--primary)] text-xs font-medium px-2 py-1 rounded-full">
          {destination.subCategory}
        </span>
      </div>
 
      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] mb-1">
          <MapPin className="h-3.5 w-3.5" />
          {destination.location}
        </div>
 
        <h3 className="font-semibold text-lg text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
          {destination.name}
        </h3>
 
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
          <span className="text-sm font-medium">{destination.rating}</span>
          <span className="text-sm text-[var(--muted-foreground)]">({destination.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
 