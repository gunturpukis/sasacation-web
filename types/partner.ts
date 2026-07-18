export type PropertyStatus = "pending" | "verified" | "rejected" | "suspended";

export type Property = {
  id: string;
  owner_id: string;
  business_name: string;
  description: string | null;
  phone: string;
  address: string;
  status: PropertyStatus;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyResponse = {
  success: boolean;
  data: Property;
  message?: string;
};

// Bentuk hotel yang dipakai khusus di form kelola mitra — field yang benar-benar
// ada di database backend (types/hotel.ts punya `category`/`type` yang
// sebenarnya TIDAK ada di skema backend saat ini, jadi sengaja tidak dipakai
// di sini supaya form tidak mengirim field yang tidak pernah disimpan).
export type PartnerHotel = {
  id: string;
  name: string;
  location: string;
  address: string | null;
  price: number;
  rating: number;
  review_count: number;
  image: string;
  images: string[];
  description: string | null;
  amenities: string[];
  available: boolean;
  featured: boolean;
  property_id: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type PartnerHotelsResponse = {
  success: boolean;
  data: PartnerHotel[];
};

export type PartnerHotelResponse = {
  success: boolean;
  data: PartnerHotel;
  message?: string;
};
