export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      "official-artwork"?: {
        front_default: string;
      };
    };
  };
}

export interface PokemonSearchResult {
  name: string;
  url: string;
}

export async function searchPokemonByName(
  name: string
): Promise<Pokemon | null> {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching Pokemon:", error);
    return null;
  }
}

export function getPokemonImageUrl(pokemon: Pokemon): string {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    ""
  );
}

