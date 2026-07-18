const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// export async function loginUser(email: string, password: string) {
//   const res = await fetch(`${API_BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "Login gagal");
//   }

//   return res.json();
// }

// export async function registerUser(name: string, email: string, password: string) {
//   const res = await fetch(`${API_BASE_URL}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password }),
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "Registrasi gagal");
//   }

//   return res.json();
// }

export async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");
  return data;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registrasi gagal");
  return data;
}

// ─── Partner ────────────────────────────────────────────────────────────────
export async function applyForPartner(payload: {
  businessName: string;
  description?: string;
  phone: string;
  address: string;
}) {
  const res = await fetch("/api/partners/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Pengajuan mitra gagal");
  return data;
}

export async function createHotel(payload: Record<string, unknown>) {
  const res = await fetch("/api/partners/hotels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat hotel");
  return data;
}

export async function updateHotel(id: string, payload: Record<string, unknown>) {
  const res = await fetch(`/api/partners/hotels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal memperbarui hotel");
  return data;
}

export async function deleteHotel(id: string) {
  const res = await fetch(`/api/partners/hotels/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus hotel");
  return data;
}