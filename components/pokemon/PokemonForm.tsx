"use client";

import {
  createPokemonClientSchema,
  updatePokemonSchema,
  CreatePokemonClientTypes,
  UpdatePokemonClientTypes,
} from "@/lib/zod schemas/pokemonSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  createPokemonAction,
  updatePokemonAction,
} from "@/lib/actions/pokemonActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Tables } from "@/types/supabase";

type Pokemon = Tables<"Pokemon">;

export default function PokemonForm({
  pokemon,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: {
  pokemon?: Pokemon | null;
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
}) {
  const router = useRouter();
  const isEditMode = !!pokemon;

  const form = useForm<CreatePokemonClientTypes | UpdatePokemonClientTypes>({
    resolver: zodResolver(
      isEditMode ? updatePokemonSchema : createPokemonClientSchema
    ),
    defaultValues: {
      pokemon_name: pokemon?.pokemon_name || "",
      pokemon_image_url: pokemon?.pokemon_image_url || "",
    },
  });

  const { mutate: createPokemon, isPending: isCreating } = useMutation({
    mutationFn: createPokemonAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to add Pokemon");
        return;
      }
      toast.success("Pokemon added successfully");
      form.reset();
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add Pokemon");
    },
  });

  const { mutate: updatePokemon, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) => updatePokemonAction(pokemon!.id, formData),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to update Pokemon");
        setIsSubmitting?.(false);
        return;
      }
      toast.success("Pokemon updated successfully");
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update Pokemon");
      setIsSubmitting?.(false);
    },
  });

  const handleSubmit = (
    data: CreatePokemonClientTypes | UpdatePokemonClientTypes
  ) => {
    if (isEditMode) {
      setIsSubmitting?.(true);
      const updateFormData = new FormData();
      if (data.pokemon_name)
        updateFormData.append("pokemon_name", data.pokemon_name);
      if (data.pokemon_image_url)
        updateFormData.append("pokemon_image_url", data.pokemon_image_url);
      updatePokemon(updateFormData);
    } else {
      const createFormData = new FormData();
      createFormData.append(
        "pokemon_id",
        (data as CreatePokemonClientTypes).pokemon_id.toString()
      );
      createFormData.append(
        "pokemon_name",
        (data as CreatePokemonClientTypes).pokemon_name
      );
      createFormData.append(
        "pokemon_image_url",
        (data as CreatePokemonClientTypes).pokemon_image_url
      );
      createPokemon(createFormData);
    }
  };

  const isPending = isCreating || isUpdating || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="pokemon_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pokemon Name</FormLabel>
              <FormControl>
                <Input placeholder="Pokemon name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pokemon_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
            )}
            {isEditMode ? "Update Pokemon" : "Add Pokemon"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

