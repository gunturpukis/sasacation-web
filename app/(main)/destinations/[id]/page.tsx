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
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Destinasi
      </Link>
 
      {/* Galeri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-xl overflow-hidden">
        <div className="relative md:col-span-2 h-80 md:h-96 bg-slate-100">
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
              <div key={i} className="relative h-full bg-slate-100">
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
 
      <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
        {destination.subCategory}
      </span>
 
      <div className="flex items-center gap-1 text-slate-500 mb-2">
        <MapPin className="h-4 w-4" />
        {destination.address}
      </div>
 
      <h1 className="text-3xl font-bold text-emerald-950 mb-3">{destination.name}</h1>
 
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        <span className="font-semibold">{destination.rating}</span>
        <span className="text-slate-400">({destination.reviewCount} ulasan)</span>
      </div>
 
      <p className="text-slate-600 leading-relaxed">{destination.description}</p>
    </main>
  );
}
 