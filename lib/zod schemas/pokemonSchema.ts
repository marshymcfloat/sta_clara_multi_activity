import { z } from "zod";

export const createPokemonClientSchema = z.object({
  pokemon_id: z
    .number()
    .min(1, { message: "Pokemon ID is required" })
    .max(10000, { message: "Invalid Pokemon ID" }),
  pokemon_name: z
    .string()
    .min(1, { message: "Pokemon name is required" })
    .max(255, { message: "Pokemon name must be less than 255 characters" }),
  pokemon_image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .min(1, { message: "Image URL is required" }),
});

export const createPokemonServerSchema = z.object({
  pokemon_id: z
    .number()
    .min(1, { message: "Pokemon ID is required" })
    .max(10000, { message: "Invalid Pokemon ID" }),
  pokemon_name: z
    .string()
    .min(1, { message: "Pokemon name is required" })
    .max(255, { message: "Pokemon name must be less than 255 characters" }),
  pokemon_image_url: z
    .string()
    .url({ message: "Invalid image URL" })
    .min(1, { message: "Image URL is required" }),
});

export const updatePokemonSchema = createPokemonClientSchema.partial();
export const updatePokemonServerSchema = createPokemonServerSchema.partial();

export type CreatePokemonClientTypes = z.infer<typeof createPokemonClientSchema>;
export type CreatePokemonServerTypes = z.infer<typeof createPokemonServerSchema>;
export type UpdatePokemonClientTypes = z.infer<typeof updatePokemonSchema>;
export type UpdatePokemonServerTypes = z.infer<typeof updatePokemonServerSchema>;

