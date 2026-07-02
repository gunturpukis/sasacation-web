export type Hotel = {
  id: string;
  name: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  category: string;
  type: string;
  featured: boolean;
  available: boolean;
};
 
export type HotelsResponse = {
  success: boolean;
  data: Hotel[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
 
export type HotelDetailResponse = {
  success: boolean;
  data: Hotel;
};
 