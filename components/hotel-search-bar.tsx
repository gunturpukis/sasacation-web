"use client";
 
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
 
export function HotelSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
 
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
 
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
 
    router.push(`/hotels?${params.toString()}`);
  }
 
  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
      <Input
        placeholder="Cari hotel atau lokasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button type="submit" size="icon" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}