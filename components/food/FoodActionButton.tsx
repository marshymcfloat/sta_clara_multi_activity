"use client";

import { Edit, Ellipsis, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import EditFoodDialog from "./EditFoodDialog";
import { deleteFoodAction } from "@/lib/actions/foodActions";
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

type Food = Tables<"Food">;

export default function FoodActionButton({
  food,
  onEditDialogChange,
}: {
  food: Food;
  onEditDialogChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditDialogChange = (open: boolean) => {
    setEditDialogOpen(open);
    onEditDialogChange?.(open);
  };

  const { mutate: deleteFood, isPending: isDeleting } = useMutation({
    mutationFn: deleteFoodAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to delete food photo");
        return;
      }
      toast.success(data.message || "Food photo deleted successfully");
      router.refresh();
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete food photo");
    },
  });

  const handleDelete = () => {
    deleteFood(food.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            className="absolute top-2 right-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditDialogOpen(true);
            }}
          >
            <Edit className="mr-2 w-4 h-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 w-4 h-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditFoodDialog
        food={food}
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        onSuccess={() => router.refresh()}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              food photo "{food.name}".
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

