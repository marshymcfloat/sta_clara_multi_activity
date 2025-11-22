import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PokemonListClient from "./PokemonListClient";
import { Tables } from "@/types/supabase";

type Review = Tables<"PokemonReview">;

export default async function PokemonsDataContainer() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  const { data: pokemons, error: pokemonsError } = await supabase
    .from("Pokemon")
    .select("*")
    .order("created_at", { ascending: false });

  if (pokemonsError) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <h1 className="text-2xl font-bold">Error fetching Pokemon</h1>
        <p className="text-sm text-gray-500">{pokemonsError.message}</p>
      </div>
    );
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("PokemonReview")
    .select("*")
    .order("created_at", { ascending: false });

  const reviewsByPokemonId: Record<number, Review[]> = {};
  if (reviews) {
    reviews.forEach((review) => {
      if (!reviewsByPokemonId[review.pokemon_id]) {
        reviewsByPokemonId[review.pokemon_id] = [];
      }
      reviewsByPokemonId[review.pokemon_id].push(review);
    });
  }

  return (
    <PokemonListClient
      pokemons={pokemons || []}
      reviewsByPokemonId={reviewsByPokemonId}
      currentUserId={user.id}
    />
  );
}

