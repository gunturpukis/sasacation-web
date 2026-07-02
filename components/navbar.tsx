
"use client";
 
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
 
export function Navbar() {
  const { user, isLoading, logout } = useAuth();
 
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-emerald-950">
          <MapPin className="h-5 w-5 text-emerald-600" />
          Sasacation
        </Link>
 
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/destinations" className="hover:text-emerald-600 transition-colors">
            Destinasi
          </Link>
          <Link href="/hotels" className="hover:text-emerald-600 transition-colors">
            Hotel
          </Link>
          <Link href="/culinary" className="hover:text-emerald-600 transition-colors">
            Kuliner
          </Link>
        </nav>
 
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="hidden sm:block text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
              >
                Halo, {user.name.split(" ")[0]}
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
 