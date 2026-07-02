import { DestinationsResponse, DestinationDetailResponse } from "@/types/destinations";
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
 
type GetDestinationsParams = {
  search?: string;
};
 
export async function getDestinations(
  params: GetDestinationsParams = {}
): Promise<DestinationsResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
 
  const res = await fetch(`${API_BASE_URL}/explore/destinations?${query.toString()}`, {
    cache: "no-store",
  });
 
  if (!res.ok) {
    throw new Error("Gagal memuat data destinasi");
  }
 
  return res.json();
}
 
export async function getDestinationById(id: string): Promise<DestinationDetailResponse> {
  const res = await fetch(`${API_BASE_URL}/explore/destinations/${id}`, {
    cache: "no-store",
  });
 
  if (!res.ok) {
    throw new Error("Destinasi tidak ditemukan");
  }
 
  return res.json();
}
 