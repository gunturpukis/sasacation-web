
"use client";
 
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Loader2, Waves } from "lucide-react";
 
export function Navbar() {
  const { user, isLoading, logout } = useAuth();
 
  return (
    <header className="sticky top-0 z-50 bg-[var(--primary)] text-[var(--primary-foreground)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-xl">
          <Waves className="h-5 w-5 text-[var(--gold)]" />
          Sasacation
        </Link>
 
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--primary-foreground)]/75">
          <Link href="/destinations" className="hover:text-[var(--gold)] transition-colors">
            Destinasi
          </Link>
          <Link href="/hotels" className="hover:text-[var(--gold)] transition-colors">
            Hotel
          </Link>
          <Link href="/culinary" className="hover:text-[var(--gold)] transition-colors">
            Kuliner
          </Link>
        </nav>
 
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[var(--primary-foreground)]/60" />
          ) : user ? (
            <>
              {user.role === "partner" ? (
                <Link
                  href="/partner/dashboard"
                  className="hidden sm:block text-sm font-medium text-[var(--primary-foreground)]/85 hover:text-[var(--gold)] transition-colors"
                >
                  Dashboard Mitra
                </Link>
              ) : user.role === "user" ? (
                <Link
                  href="/partner/apply"
                  className="hidden sm:block text-sm font-medium text-[var(--primary-foreground)]/85 hover:text-[var(--gold)] transition-colors"
                >
                  Jadi Mitra
                </Link>
              ) : null}
              <Link
                href="/profile"
                className="hidden sm:block text-sm font-medium text-[var(--primary-foreground)]/85 hover:text-[var(--gold)] transition-colors"
              >
                Halo, {user.name.split(" ")[0]}
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="border-[var(--primary-foreground)]/30 text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]/10 hover:text-[var(--primary-foreground)]"
                onClick={logout}
              >
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]/10 hover:text-[var(--primary-foreground)]"
                asChild
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                size="sm"
                className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85"
                asChild
              >
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
