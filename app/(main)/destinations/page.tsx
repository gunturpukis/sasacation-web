import { getDestinations } from "@/lib/destinations/lib_destinations";
import { DestinationCard } from "@/components/destinations/destinations-card";
import { DestinationFilter } from "@/components/destinations/destinations-filter";
 
export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const { data: allDestinations } = await getDestinations({ search: params.search });
 
  const destinations = params.category
    ? allDestinations.filter(
        (d) => d.subCategory.toLowerCase() === params.category!.toLowerCase()
      )
    : allDestinations;
 
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-950 mb-2">
          Destinasi Wisata
        </h1>
        <p className="text-slate-500 mb-6">
          Jelajahi keindahan alam dan budaya Lombok
        </p>
        <DestinationFilter />
      </div>
 
      {destinations.length === 0 ? (
        <p className="text-center text-slate-500 py-16">
          Tidak ada destinasi yang ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </main>
  );
}
 