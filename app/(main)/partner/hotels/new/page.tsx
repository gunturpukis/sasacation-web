import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HotelForm } from "@/components/hotel-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function NewHotelPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login?redirect=/partner/hotels/new");

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/partner/hotels"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Hotel Saya
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Tambah Hotel Baru</CardTitle>
          <CardDescription>Isi detail hotel yang ingin Anda listing di Sasacation.</CardDescription>
        </CardHeader>
        <CardContent>
          <HotelForm />
        </CardContent>
      </Card>
    </main>
  );
}
