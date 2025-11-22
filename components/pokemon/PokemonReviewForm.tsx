"use client";

import {
  createReviewClientSchema,
  updateReviewSchema,
  CreateReviewClientTypes,
  UpdateReviewClientTypes,
} from "@/lib/zod schemas/reviewSchema";
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
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  createPokemonReviewAction,
  updatePokemonReviewAction,
} from "@/lib/actions/pokemonReviewActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Tables } from "@/types/supabase";

type Review = Tables<"PokemonReview">;

export default function PokemonReviewForm({
  pokemonId,
  review,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: {
  pokemonId: number;
  review?: Review | null;
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
}) {
  const router = useRouter();
  const isEditMode = !!review;

  const form = useForm<CreateReviewClientTypes | UpdateReviewClientTypes>({
    resolver: zodResolver(
      isEditMode ? updateReviewSchema : createReviewClientSchema
    ),
    defaultValues: {
      content: review?.content || "",
      rating: review?.rating || undefined,
    },
  });

  const { mutate: createReview, isPending: isCreating } = useMutation({
    mutationFn: (formData: FormData) =>
      createPokemonReviewAction(pokemonId, formData),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to create review");
        return;
      }
      toast.success("Review created successfully");
      form.reset();
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create review");
    },
  });

  const { mutate: updateReview, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) =>
      updatePokemonReviewAction(review!.id, formData),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to update review");
        setIsSubmitting?.(false);
        return;
      }
      toast.success("Review updated successfully");
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update review");
      setIsSubmitting?.(false);
    },
  });

  const handleSubmit = (
    data: CreateReviewClientTypes | UpdateReviewClientTypes
  ) => {
    if (isEditMode) {
      setIsSubmitting?.(true);
      const updateFormData = new FormData();
      if (data.content) updateFormData.append("content", data.content);
      if (data.rating !== undefined)
        updateFormData.append("rating", data.rating.toString());
      updateReview(updateFormData);
    } else {
      const createFormData = new FormData();
      createFormData.append("content", (data as CreateReviewClientTypes).content);
      if ((data as CreateReviewClientTypes).rating !== undefined) {
        createFormData.append(
          "rating",
          (data as CreateReviewClientTypes).rating!.toString()
        );
      }
      createReview(createFormData);
    }
  };

  const isPending = isCreating || isUpdating || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your review..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5) {isEditMode && "(optional)"}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating (optional)"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
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
            {isEditMode ? "Update Review" : "Create Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

