"use client";

import { useMemo, useState } from "react";
import FoodList from "./FoodList";
import FoodSearchSort from "./FoodSearchSort";
import { Tables } from "@/types/supabase";

type Food = Tables<"Food">;
type Review = Tables<"Review">;
type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function FoodListClient({
  foods: initialFoods,
  reviewsByFoodId,
}: {
  foods: Food[];
  reviewsByFoodId: Record<number, Review[]>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredAndSortedFoods = useMemo(() => {
    let filtered = initialFoods;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((food) =>
        food.name.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "date-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "date-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [initialFoods, searchQuery, sortBy]);

  return (
    <div>
      <FoodSearchSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <FoodList
        foods={filteredAndSortedFoods}
        reviewsByFoodId={reviewsByFoodId}
      />
    </div>
  );
}
