"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PokemonReviewForm from "./PokemonReviewForm";
import { Tables } from "@/types/supabase";

type Review = Tables<"PokemonReview">;

export default function EditPokemonReviewDialog({
  pokemonId,
  review,
  open,
  onOpenChange,
  onSuccess,
}: {
  pokemonId: number;
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    setIsSubmitting(false);
    onOpenChange(false);
    onSuccess?.();
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>
        <PokemonReviewForm
          pokemonId={pokemonId}
          review={review}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

