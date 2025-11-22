"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import PokemonReviewCard from "./PokemonReviewCard";
import AddPokemonReviewDialog from "./AddPokemonReviewDialog";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

type Pokemon = Tables<"Pokemon">;
type Review = Tables<"PokemonReview">;

export default function PokemonDetailDialog({
  pokemon,
  reviews,
  open,
  onOpenChange,
  currentUserId,
}: {
  pokemon: Pokemon | null;
  reviews: Review[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}) {
  const router = useRouter();

  if (!pokemon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <Image
              src={pokemon.pokemon_image_url}
              alt={pokemon.pokemon_name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <DialogHeader className="px-0">
                <DialogTitle className="text-2xl font-bold capitalize">
                  {pokemon.pokemon_name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(pokemon.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <AddPokemonReviewDialog
                  pokemonId={pokemon.id}
                  onSuccess={() => router.refresh()}
                />
              </div>

              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      No reviews yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Be the first to review this Pokemon!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <PokemonReviewCard
                      key={review.id}
                      review={review}
                      currentUserId={currentUserId}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

