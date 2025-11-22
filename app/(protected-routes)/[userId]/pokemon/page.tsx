import AddPokemonButton from "@/components/pokemon/AddPokemonButton";
import PokemonsDataContainer from "@/components/pokemon/PokemonsDataContainer";
import PokemonListSkeleton from "@/components/pokemon/PokemonListSkeleton";
import { Suspense } from "react";

export default function page() {
  return (
    <main className="flex-1 p-2 sm:p-4">
      <AddPokemonButton />
      <Suspense fallback={<PokemonListSkeleton />}>
        <PokemonsDataContainer />
      </Suspense>
    </main>
  );
}
