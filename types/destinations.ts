
export type Destination = {
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
  category: string;
  type: string;
  subCategory: string;
};
 
export type DestinationsResponse = {
  success: boolean;
  data: Destination[];
};
 
export type DestinationDetailResponse = {
  success: boolean;
  data: Destination;
};
 