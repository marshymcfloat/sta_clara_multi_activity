"use client";

import PokemonCard from "./PokemonCard";
import { Tables } from "@/types/supabase";

type Pokemon = Tables<"Pokemon">;
type Review = Tables<"PokemonReview">;

export default function PokemonList({
  pokemons,
  reviewsByPokemonId,
  currentUserId,
}: {
  pokemons: Pokemon[];
  reviewsByPokemonId: Record<number, Review[]>;
  currentUserId: string;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          reviews={reviewsByPokemonId[pokemon.id] || []}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

