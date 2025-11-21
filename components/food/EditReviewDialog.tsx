"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ReviewForm from "./ReviewForm";
import { Tables } from "@/types/supabase";

type Review = Tables<"Review">;

export default function EditReviewDialog({
  foodId,
  review,
  open,
  onOpenChange,
  onSuccess,
}: {
  foodId: number;
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
        <ReviewForm
          foodId={foodId}
          review={review}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

