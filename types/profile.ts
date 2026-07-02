
import { Booking } from "@/types/checkout";
import { Hotel } from "@/types/hotel";
 
export type BookingWithHotel = Booking & {
  hotel: Hotel | null;
};
 
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
};
 