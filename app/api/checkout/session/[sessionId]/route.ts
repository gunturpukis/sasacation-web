import { NextResponse } from "next/server";
import { cookies } from "next/headers";
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
 
export async function GET(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
 
  if (!token) {
    return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
  }
 
  const res = await fetch(`${API_BASE_URL}/checkout/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
 
  const data = await res.json();
 
  if (!res.ok || !data.success) {
    return NextResponse.json(
      { message: data.message || "Session tidak ditemukan" },
      { status: res.status }
    );
  }
 
  return NextResponse.json(data);
}