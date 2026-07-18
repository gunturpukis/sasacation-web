"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteHotel } from "@/lib/api";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteHotelButton({ hotelId, hotelName }: { hotelId: string; hotelName: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Nonaktifkan "${hotelName}" dari listing? Hotel tidak akan muncul lagi di pencarian, tapi riwayat booking tetap tersimpan.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await deleteHotel(hotelId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menonaktifkan hotel");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      Nonaktifkan
    </Button>
  );
}
