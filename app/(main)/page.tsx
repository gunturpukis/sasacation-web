import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Hotel, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-emerald-50 to-white">
        <span className="text-sm font-medium text-emerald-600 mb-4 tracking-wide uppercase">
          Selamat Datang di
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-emerald-950 mb-6">
          Sasacation
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-xl mb-10">
          Jelajahi keindahan alam, budaya, dan kuliner khas Lombok bersama kami.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/register">
              Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 max-w-5xl mx-auto w-full">
        <FeatureCard
          icon={<MapPin className="h-6 w-6 text-emerald-600" />}
          title="Destinasi Wisata"
          description="Temukan pantai, gunung, dan tempat eksotis di Lombok."
        />
        <FeatureCard
          icon={<Hotel className="h-6 w-6 text-emerald-600" />}
          title="Hotel & Penginapan"
          description="Pilihan akomodasi nyaman sesuai kebutuhanmu."
        />
        <FeatureCard
          icon={<UtensilsCrossed className="h-6 w-6 text-emerald-600" />}
          title="Kuliner Khas"
          description="Cicipi cita rasa autentik masakan Lombok."
        />
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-emerald-50 rounded-full">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  );
}