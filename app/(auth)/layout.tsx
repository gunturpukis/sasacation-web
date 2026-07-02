import Link from "next/link";
import { Waves } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--primary)]/8 to-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex flex-col items-center gap-2 text-center mb-8">
          <Waves className="h-6 w-6 text-[var(--accent)]" />
          <h1 className="text-3xl text-[var(--foreground)]">Sasacation</h1>
        </Link>
        {children}
      </div>
    </main>
  );
}