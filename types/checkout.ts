export type PaymentMethod = {
  id: string;
  label: string;
  icon: string;
  available: boolean;
};
 
export type CheckoutSession = {
  sessionId: string;
  hotel: {
    id: string;
    name: string;
    location: string;
    image: string;
    rating: number;
    amenities: string[];
  };
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  notes: string;
  pricing: {
    pricePerNight: number;
    subtotal: number;
    tax: number;
    taxRate: number;
    serviceFee: number;
    total: number;
    currency: string;
  };
  paymentMethods: PaymentMethod[];
  status: string;
  expiresAt: string;
  createdAt: string;
};
 
export type Booking = {
  id: string;
  userId: string;
  userName: string;
  hotelId: string;
  hotelName: string;
  hotelLocation: string;
  hotelImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  pricePerNight: number;
  totalPrice: number;
  notes: string;
  status: string;
  bookingCode: string;
  createdAt: string;
};
 
export type PaymentResult = {
  booking: Booking;
  payment: {
    transactionId: string;
    method: string;
    amount: number;
    status: string;
    paidAt: string;
  };
};