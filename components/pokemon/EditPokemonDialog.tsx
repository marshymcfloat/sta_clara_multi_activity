"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PokemonForm from "./PokemonForm";
import { Tables } from "@/types/supabase";

type Pokemon = Tables<"Pokemon">;

export default function EditPokemonDialog({
  pokemon,
  open,
  onOpenChange,
  onSuccess,
}: {
  pokemon: Pokemon | null;
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

  if (!pokemon) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pokemon</DialogTitle>
        </DialogHeader>
        <PokemonForm
          pokemon={pokemon}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

