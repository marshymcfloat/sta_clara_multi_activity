"use client";

import { Edit, Trash, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import EditPokemonReviewDialog from "./EditPokemonReviewDialog";
import { deletePokemonReviewAction } from "@/lib/actions/pokemonReviewActions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Tables } from "@/types/supabase";

type Review = Tables<"PokemonReview">;

export default function PokemonReviewCard({
  review,
  currentUserId,
}: {
  review: Review;
  currentUserId: string;
}) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: deleteReview, isPending: isDeleting } = useMutation({
    mutationFn: deletePokemonReviewAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to delete review");
        return;
      }
      toast.success("Review deleted successfully");
      router.refresh();
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  const handleDelete = () => {
    deleteReview(review.id);
  };

  return (
    <>
      <Card className="group border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {review.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                  </span>
                  <span className="text-muted-foreground text-lg">
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
              )}
              <CardDescription className="text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            {review.created_by === currentUserId && (
              <div className="flex gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <p className="text-sm leading-relaxed">{review.content}</p>
        </CardContent>
      </Card>

      <EditPokemonReviewDialog
        pokemonId={review.pokemon_id}
        review={review}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => router.refresh()}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

