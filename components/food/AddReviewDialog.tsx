"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ReviewForm from "./ReviewForm";
import { Button } from "../ui/button";
import { MessageSquarePlus } from "lucide-react";

export default function AddReviewDialog({
  foodId,
  onSuccess,
}: {
  foodId: number;
  onSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <ReviewForm foodId={foodId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
