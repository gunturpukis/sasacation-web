"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerApplySchema, type PartnerApplyInput } from "@/lib/validations/partner";
import { applyForPartner } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export function PartnerApplyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PartnerApplyInput>({
    resolver: zodResolver(partnerApplySchema),
    defaultValues: { businessName: "", description: "", phone: "", address: "" },
  });

  async function onSubmit(values: PartnerApplyInput) {
    setIsLoading(true);
    setError(null);
    try {
      await applyForPartner(values);
      router.push("/partner/dashboard");
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
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Bisnis / Properti</FormLabel>
              <FormControl>
                <Input placeholder="Villa Senggigi Asri" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon</FormLabel>
              <FormControl>
                <Input placeholder="08123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Properti</FormLabel>
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
              <FormLabel>Deskripsi Singkat (opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Ceritakan sedikit tentang bisnis Anda..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-sm text-[var(--destructive)] bg-[var(--destructive)]/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/85" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Kirim Pengajuan
        </Button>
      </form>
    </Form>
  );
}
