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
import FoodActionButton from "./FoodActionButton";
import FoodDetailDialog from "./FoodDetailDialog";
import { Tables } from "@/types/supabase";

type Food = Tables<"Food">;
type Review = Tables<"Review">;

export default function FoodCard({
  food,
  reviews = [],
}: {
  food: Food;
  reviews?: Review[];
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
          <div className="relative w-full aspect-square overflow-hidden bg-muted ">
            <Image
              src={food.url!}
              alt={food.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>
        <CardContent className="p-2.5 space-y-1 relative">
          <FoodActionButton
            food={food}
            onEditDialogChange={setEditDialogOpen}
          />
          <CardTitle className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {food.name}
          </CardTitle>
          <CardDescription className="text-[10px] text-muted-foreground">
            {new Date(food.created_at).toLocaleDateString("en-US", {
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

      <FoodDetailDialog
        food={food}
        reviews={reviews}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </>
  );
}
