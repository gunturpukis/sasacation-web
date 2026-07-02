
"use client";
 
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
 
const CATEGORIES = ["Semua", "Adventure", "Islands", "Beaches", "Culture"];
 
export function DestinationFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const activeCategory = searchParams.get("category") || "Semua";
 
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    router.push(`/destinations?${params.toString()}`);
  }
 
  function handleCategoryClick(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "Semua") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/destinations?${params.toString()}`);
  }
 
  return (
    <div className="space-y-4 mb-8">
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
        <Input
          placeholder="Cari destinasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" size="icon" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </form>
 
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
 