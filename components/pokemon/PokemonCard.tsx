"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import PokemonActionButton from "./PokemonActionButton";
import PokemonDetailDialog from "./PokemonDetailDialog";
import { Tables } from "@/types/supabase";

type Pokemon = Tables<"Pokemon">;
type Review = Tables<"PokemonReview">;

export default function PokemonCard({
  pokemon,
  reviews = [],
  currentUserId,
}: {
  pokemon: Pokemon;
  reviews?: Review[];
  currentUserId: string;
}) {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <Card
        className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer py-0"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            editDialogOpen ||
            target.closest('[data-slot="dropdown-menu"]') ||
            target.closest('[data-slot="dialog"]') ||
            target.closest("button") ||
            target.closest('[role="menuitem"]') ||
            target.closest('[role="dialog"]')
          ) {
            return;
          }
          setDetailDialogOpen(true);
        }}
      >
        <CardHeader className="p-0">
          <div className="relative w-full aspect-square overflow-hidden bg-muted">
            <Image
              src={pokemon.pokemon_image_url}
              alt={pokemon.pokemon_name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>
        <CardContent className="p-2.5 space-y-1 relative">
          {pokemon.created_by === currentUserId && (
            <PokemonActionButton
              pokemon={pokemon}
              onEditDialogChange={setEditDialogOpen}
            />
          )}
          <CardTitle className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors capitalize">
            {pokemon.pokemon_name}
          </CardTitle>
          <CardDescription className="text-[10px] text-muted-foreground">
            {new Date(pokemon.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </CardDescription>
          {reviews.length > 0 && (
            <CardDescription className="text-[10px] text-muted-foreground">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </CardDescription>
          )}
        </CardContent>
      </Card>

      <PokemonDetailDialog
        pokemon={pokemon}
        reviews={reviews}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        currentUserId={currentUserId}
      />
    </>
  );
}

