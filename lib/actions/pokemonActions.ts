"use server";

import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import {
  createPokemonServerSchema,
  updatePokemonServerSchema,
} from "../zod schemas/pokemonSchema";

export async function createPokemonAction(formData: FormData) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const pokemon_id = formData.get("pokemon_id");
    const pokemon_name = formData.get("pokemon_name");
    const pokemon_image_url = formData.get("pokemon_image_url");

    const dataObject = {
      pokemon_id: pokemon_id ? Number(pokemon_id) : undefined,
      pokemon_name,
      pokemon_image_url,
    };

    const validationResult = createPokemonServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const { data: existingPokemon } = await supabase
      .from("Pokemon")
      .select("id")
      .eq("pokemon_id", validationResult.data.pokemon_id)
      .eq("created_by", user.id)
      .single();

    if (existingPokemon) {
      return {
        success: false,
        error: "You have already added this Pokemon",
      };
    }

    const { data: pokemonData, error: pokemonError } = await supabase
      .from("Pokemon")
      .insert({
        pokemon_id: validationResult.data.pokemon_id,
        pokemon_name: validationResult.data.pokemon_name,
        pokemon_image_url: validationResult.data.pokemon_image_url,
        created_by: user.id,
      })
      .select()
      .single();

    if (pokemonError) {
      return {
        success: false,
        error: pokemonError.message || "Failed to create Pokemon",
      };
    }

    return {
      success: true,
      data: pokemonData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function updatePokemonAction(
  pokemonId: number,
  formData: FormData
) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { data: existingPokemon, error: fetchError } = await supabase
      .from("Pokemon")
      .select("created_by")
      .eq("id", pokemonId)
      .single();

    if (fetchError || !existingPokemon) {
      return {
        success: false,
        error: "Pokemon not found",
      };
    }

    if (existingPokemon.created_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const pokemon_name = formData.get("pokemon_name");
    const pokemon_image_url = formData.get("pokemon_image_url");

    const dataObject: Record<string, unknown> = {};
    if (pokemon_name) dataObject.pokemon_name = pokemon_name;
    if (pokemon_image_url) dataObject.pokemon_image_url = pokemon_image_url;

    const validationResult = updatePokemonServerSchema.safeParse(dataObject);

    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.message || "Validation error",
      };
    }

    const { data: updatedPokemon, error: updateError } = await supabase
      .from("Pokemon")
      .update(validationResult.data)
      .eq("id", pokemonId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message || "Failed to update Pokemon",
      };
    }

    return {
      success: true,
      data: updatedPokemon,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function deletePokemonAction(pokemonId: number) {
  try {
    const supabase = await createClient(cookies());

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { data: existingPokemon, error: fetchError } = await supabase
      .from("Pokemon")
      .select("created_by")
      .eq("id", pokemonId)
      .single();

    if (fetchError || !existingPokemon) {
      return {
        success: false,
        error: "Pokemon not found",
      };
    }

    if (existingPokemon.created_by !== user.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const { error: deleteError } = await supabase
      .from("Pokemon")
      .delete()
      .eq("id", pokemonId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message || "Failed to delete Pokemon",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
