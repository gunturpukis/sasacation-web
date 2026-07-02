import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationById } from "@/lib/destinations/lib_destinations";
import { Star, MapPin, ArrowLeft } from "lucide-react";
 
export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
 
  let destination;
  try {
    const res = await getDestinationById(id);
    destination = res.data;
  } catch {
    notFound();
  }
 
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href="/destinations"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Destinasi
      </Link>
 
      {/* Galeri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-xl overflow-hidden">
        <div className="relative md:col-span-2 h-80 md:h-96 bg-[var(--muted)]">
          <Image
            src={destination.images[0]}
            alt={destination.name}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
          />
        </div>
        {destination.images.length > 1 && (
          <div className="hidden md:grid grid-rows-2 gap-3">
            {destination.images.slice(1, 3).map((img, i) => (
              <div key={i} className="relative h-full bg-[var(--muted)]">
                <Image
                  src={img}
                  alt={`${destination.name} ${i + 2}`}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
 
      <span className="inline-block bg-[var(--primary)]/5 text-[var(--primary)] text-xs font-medium px-3 py-1 rounded-full mb-3">
        {destination.subCategory}
      </span>
 
      <div className="flex items-center gap-1 text-[var(--muted-foreground)] mb-2">
        <MapPin className="h-4 w-4" />
        {destination.address}
      </div>
 
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">{destination.name}</h1>
 
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)]" />
        <span className="font-semibold">{destination.rating}</span>
        <span className="text-[var(--muted-foreground)]">({destination.reviewCount} ulasan)</span>
      </div>
 
      <p className="text-[var(--muted-foreground)] leading-relaxed">{destination.description}</p>
    </main>
  );
}
 