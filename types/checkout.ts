export type PaymentMethod = {
  id: string;
  label: string;
  icon: string;
  available: boolean;
};

// FIX: sebelumnya ada field sessionId/status/createdAt yang sebenarnya TIDAK
// PERNAH dikembalikan backend (backend /checkout/initiate stateless, tidak
// pernah menyimpan session) — itu sebabnya checkout selalu gagal dengan
// "sessionId=undefined". Tipe ini sekarang persis mengikuti response asli.
export type CheckoutSession = {
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
  expiresAt: string;
};

// Disimpan di sessionStorage antara halaman booking form -> checkout, karena
// tidak ada session tersimpan di server yang bisa direferensikan lewat ID.
export type StoredCheckoutData = CheckoutSession & {
  hotelId: string;
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

// Respons /checkout/pay yang baru: BUKAN hasil akhir, tapi info untuk buka
// halaman pembayaran Midtrans Snap. Hasil final baru didapat lewat polling
// ke /checkout/status/:transactionId (lihat PaymentStatusResult di bawah).
export type CheckoutPaymentInitiated = {
  booking: { booking_code: string; [key: string]: unknown };
  payment: {
    transactionId: string;
    method: string;
    amount: number;
    status: string;
  };
  snapToken: string;
  redirectUrl: string;
};

// Respons GET /checkout/status/:transactionId (dipakai untuk polling)
export type PaymentStatusResult = {
  payment: {
    transactionId: string;
    method: string;
    amount: number;
    status: "pending" | "success" | "failed" | "refunded";
    paidAt: string | null;
  };
  booking: {
    bookingCode: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    status: string;
  };
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
