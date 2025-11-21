"use client";

import { useMemo, useState } from "react";
import PhotoList from "./PhotoList";
import PhotoSearchSort from "./PhotoSearchSort";
import { Tables } from "@/types/supabase";

type Photo = Tables<"Photo">;
type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function PhotoListClient({
  photos: initialPhotos,
}: {
  photos: Photo[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredAndSortedPhotos = useMemo(() => {
    let filtered = initialPhotos;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((photo) =>
        photo.name.toLowerCase().includes(query)
      );
    }

    // Sort photos
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [initialPhotos, searchQuery, sortBy]);

  return (
    <div>
      <PhotoSearchSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <PhotoList photos={filteredAndSortedPhotos} />
    </div>
  );
}

