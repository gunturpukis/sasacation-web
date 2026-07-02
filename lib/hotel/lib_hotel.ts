import { HotelsResponse, HotelDetailResponse } from "@/types/hotel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type GetHotelsParams = {
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
};

export async function getHotels(params: GetHotelsParams = {}): Promise<HotelsResponse> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.featured) query.set("featured", "true");
  if (params.minPrice) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice) query.set("maxPrice", String(params.maxPrice));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`${API_BASE_URL}/hotels?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal memuat data hotel");
  }

  return res.json();
}

export async function getHotelById(id: string): Promise<HotelDetailResponse> {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Hotel tidak ditemukan");
  }

  return res.json();
}
