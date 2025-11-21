import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FoodListClient from "./FoodListClient";
import { Tables } from "@/types/supabase";

type Review = Tables<"Review">;

export default async function FoodsDataContainer() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  const { data: foods, error: foodsError } = await supabase
    .from("Food")
    .select("*")
    .order("created_at", { ascending: false });

  if (foodsError) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <h1 className="text-2xl font-bold">Error fetching foods</h1>
        <p className="text-sm text-gray-500">{foodsError.message}</p>
      </div>
    );
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("Review")
    .select("*")
    .order("created_at", { ascending: false });

  const reviewsByFoodId: Record<number, Review[]> = {};
  if (reviews) {
    reviews.forEach((review) => {
      if (!reviewsByFoodId[review.food_id]) {
        reviewsByFoodId[review.food_id] = [];
      }
      reviewsByFoodId[review.food_id].push(review);
    });
  }

  return (
    <FoodListClient foods={foods || []} reviewsByFoodId={reviewsByFoodId} />
  );
}
