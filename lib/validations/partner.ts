import { z } from "zod";

export const partnerApplySchema = z.object({
  businessName: z.string().min(3, "Nama bisnis minimal 3 karakter"),
  description: z.string().optional(),
  phone: z.string().min(8, "Nomor telepon minimal 8 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
});

export type PartnerApplyInput = z.infer<typeof partnerApplySchema>;

export const hotelFormSchema = z.object({
  name: z.string().min(3, "Nama hotel minimal 3 karakter"),
  location: z.string().min(2, "Lokasi wajib diisi"),
  address: z.string().optional(),
  price: z.coerce.number().positive("Harga harus lebih dari 0"),
  description: z.string().optional(),
  // Diinput sebagai satu baris dipisah koma, di-split jadi array saat submit
  amenities: z.string().optional(),
  image: z.url("URL gambar tidak valid").optional().or(z.literal("")),
});

// z.coerce.number() punya tipe INPUT beda dari OUTPUT (string/unknown vs
// number) — react-hook-form's useForm() butuh tipe INPUT (sebelum resolver
// mengubahnya), sedangkan hasil setelah validasi (dipakai saat submit) pakai
// tipe OUTPUT. Dua-duanya diexport supaya tidak salah pakai di komponen.
export type HotelFormInput = z.input<typeof hotelFormSchema>;
export type HotelFormOutput = z.output<typeof hotelFormSchema>;
