import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/wave-divider";
import { MapPin, Hotel, UtensilsCrossed, ArrowRight, Mountain } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--primary)] text-[var(--primary-foreground)]">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-32 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide uppercase text-[var(--gold)] mb-6">
              <MapPin className="h-4 w-4" />
              Pulau Seribu Masjid, Lombok
            </span>
            <h1 className="font-heading text-5xl md:text-7xl leading-[1.05] mb-6">
              Lombok, dari
              <br />
              <span className="italic text-[var(--gold)]">puncak</span> ke
              <br />
              tepi laut.
            </h1>
            <p className="text-lg md:text-xl text-[var(--primary-foreground)]/80 max-w-lg mb-10">
              Dari lereng Rinjani sampai laut Gili yang jernih — rencanakan
              perjalananmu ke Lombok bersama Sasacation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85" asChild>
                <Link href="/register">
                  Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-[var(--primary-foreground)]/30 text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]/10 hover:text-[var(--primary-foreground)]" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-4 justify-self-end">
            <StatCard label="Destinasi" value="10+" />
            <StatCard label="Hotel & Villa" value="20+" />
            <StatCard label="Kuliner Khas" value="15+" />
          </div>
        </div>

        {/* Signature wave divider — garis pantai Lombok */}
        <WaveDivider className="absolute bottom-0 left-0 w-full h-12 md:h-16" />
      </section>

      {/* Feature Highlights */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <div className="mb-12 max-w-xl">
          <span className="text-sm font-medium tracking-wide uppercase text-[var(--accent)]">
            Jelajahi
          </span>
          <h2 className="font-heading text-3xl md:text-4xl mt-2 text-[var(--foreground)]">
            Tiga cara menikmati Lombok
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mountain className="h-6 w-6" />}
            accent="var(--primary)"
            title="Destinasi Wisata"
            description="Dari puncak Rinjani hingga Pantai Pink dan Gili Trawangan — jelajahi alam dan budaya Sasak."
            href="/destinations"
          />
          <FeatureCard
            icon={<Hotel className="h-6 w-6" />}
            accent="var(--accent)"
            title="Hotel & Penginapan"
            description="Resort tepi pantai, villa privat, hingga penginapan bernuansa budaya lokal."
            href="/hotels"
          />
          <FeatureCard
            icon={<UtensilsCrossed className="h-6 w-6" />}
            accent="var(--gold)"
            title="Kuliner Khas"
            description="Ayam Taliwang, Sate Rembiga, dan cita rasa otentik Sasak yang wajib dicoba."
            href="/culinary"
          />
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--primary-foreground)]/10 border border-[var(--primary-foreground)]/15 rounded-lg px-6 py-4 backdrop-blur-sm">
      <div className="font-heading text-3xl text-[var(--gold)]">{value}</div>
      <div className="text-sm text-[var(--primary-foreground)]/70">{label}</div>
    </div>
  );
}

function FeatureCard({
  icon,
  accent,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  accent: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block bg-[var(--card)] rounded-lg p-6 border border-[var(--border)] hover:shadow-lg transition-shadow"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div
        className="mb-4 p-3 rounded-full inline-flex"
        style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}
      >
        {icon}
      </div>
      <h3 className="font-heading text-lg mb-2 text-[var(--foreground)]">{title}</h3>
      <p className="text-[var(--muted-foreground)] text-sm">{description}</p>
    </Link>
  );
}
