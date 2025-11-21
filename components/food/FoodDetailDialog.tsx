"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Tables } from "@/types/supabase";
import ReviewCard from "./ReviewCard";
import AddReviewDialog from "./AddReviewDialog";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

type Food = Tables<"Food">;
type Review = Tables<"Review">;

export default function FoodDetailDialog({
  food,
  reviews,
  open,
  onOpenChange,
}: {
  food: Food | null;
  reviews: Review[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  if (!food) return null;

  const cleanName =
    food.name
      .split("-")
      .filter(
        (part) => !part.match(/^[0-9]+$/) && !part.match(/^[a-f0-9-]{36}$/i)
      )
      .join(" ")
      .trim() || food.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            <Image
              src={food.url!}
              alt={food.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <DialogHeader className="px-0">
                <DialogTitle className="text-2xl font-bold">
                  {cleanName}
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(food.created_at).toLocaleDateString("en-US", {
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
                <AddReviewDialog
                  foodId={food.id}
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
                      Be the first to review this food!
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
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
