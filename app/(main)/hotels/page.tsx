import { getHotels } from "@/lib/hotel/lib_hotel";
import { HotelCard } from "@/components/hotel-card";
import { HotelSearchBar } from "@/components/hotel-search-bar";
 
export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const { data: hotels } = await getHotels({ search: params.search });
 
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-950 mb-2">
          Hotel & Penginapan
        </h1>
        <p className="text-slate-500 mb-6">
          Temukan tempat menginap terbaik untuk liburanmu di Lombok
        </p>
        <HotelSearchBar />
      </div>
 
      {hotels.length === 0 ? (
        <p className="text-center text-slate-500 py-16">
          Tidak ada hotel yang ditemukan.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </main>
  );
}
 