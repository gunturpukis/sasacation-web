"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hotelFormSchema, type HotelFormInput, type HotelFormOutput } from "@/lib/validations/partner";
import { createHotel, updateHotel } from "@/lib/api";
import { PartnerHotel } from "@/types/partner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export function HotelForm({ hotel }: { hotel?: PartnerHotel }) {
  const router = useRouter();
  const isEdit = !!hotel;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<HotelFormInput, unknown, HotelFormOutput>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      name: hotel?.name ?? "",
      location: hotel?.location ?? "",
      address: hotel?.address ?? "",
      price: hotel?.price ?? 0,
      description: hotel?.description ?? "",
      amenities: hotel?.amenities?.join(", ") ?? "",
      image: hotel?.image ?? "",
    },
  });

  async function onSubmit(values: HotelFormOutput) {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        amenities: values.amenities
          ? values.amenities.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
      };

      if (isEdit) {
        await updateHotel(hotel.id, payload);
      } else {
        await createHotel(payload);
      }
      router.push("/partner/hotels");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Hotel</FormLabel>
              <FormControl>
                <Input placeholder="Villa Senggigi Asri" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lokasi</FormLabel>
                <FormControl>
                  <Input placeholder="Senggigi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga per malam (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="150"
                    {...field}
                    value={field.value as number | string | undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea placeholder="Jl. Raya Senggigi No. 5, Lombok Barat" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsikan keunikan hotel Anda..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fasilitas</FormLabel>
              <FormControl>
                <Input placeholder="WiFi, Kolam Renang, Sarapan, AC" {...field} />
              </FormControl>
              <FormDescription>Pisahkan tiap fasilitas dengan koma</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Foto Utama</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>Tempel link foto hotel (belum mendukung upload langsung)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-sm text-[var(--destructive)] bg-[var(--destructive)]/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Simpan Perubahan" : "Buat Hotel"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
