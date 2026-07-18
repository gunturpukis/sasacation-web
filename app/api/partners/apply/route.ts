import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Anda harus login terlebih dahulu" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${API_BASE_URL}/partners/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
