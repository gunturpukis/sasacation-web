import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserProfile, BookingWithHotel } from "@/types/profile";
import { BookingList } from "@/components/booking-list";
import { User, Mail, Shield } from "lucide-react";
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
 
export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
 
  if (!token) {
    redirect("/login");
  }
 
  const [meRes, bookingsRes] = await Promise.all([
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(`${API_BASE_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);
 
  if (!meRes.ok) {
    redirect("/login");
  }
 
  const meData = await meRes.json();
  const bookingsData = await bookingsRes.json();
 
  const user: UserProfile = meData.data.user;
  const bookings: BookingWithHotel[] = bookingsData.data || [];
 
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Info User */}
      <div className="rounded-xl border border-[var(--border)] p-6 mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">{user.name}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] capitalize">
              {user.role}
            </span>
          </div>
        </div>
 
        <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
            {user.email}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--muted-foreground)]" />
            ID: {user.id}
          </div>
        </div>
      </div>
 
      {/* Riwayat Booking */}
      <div>
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Riwayat Booking
        </h2>
        <BookingList bookings={bookings} />
      </div>
    </main>
  );
}
 