"use client";

import { useMemo, useState } from "react";
import PokemonList from "./PokemonList";
import PokemonSearchSort from "./PokemonSearchSort";
import { Tables } from "@/types/supabase";

type Pokemon = Tables<"Pokemon">;
type Review = Tables<"PokemonReview">;
type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

export default function PokemonListClient({
  pokemons: initialPokemons,
  reviewsByPokemonId,
  currentUserId,
}: {
  pokemons: Pokemon[];
  reviewsByPokemonId: Record<number, Review[]>;
  currentUserId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const filteredAndSortedPokemons = useMemo(() => {
    let filtered = initialPokemons;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((pokemon) =>
        pokemon.pokemon_name.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.pokemon_name.localeCompare(b.pokemon_name);
        case "name-desc":
          return b.pokemon_name.localeCompare(a.pokemon_name);
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
  }, [initialPokemons, searchQuery, sortBy]);

  return (
    <div>
      <PokemonSearchSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <PokemonList
        pokemons={filteredAndSortedPokemons}
        reviewsByPokemonId={reviewsByPokemonId}
        currentUserId={currentUserId}
      />
    </div>
  );
}
