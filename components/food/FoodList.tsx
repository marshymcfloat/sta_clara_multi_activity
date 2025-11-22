import FoodCard from "./FoodCard";
import { Tables } from "@/types/supabase";

type Food = Tables<"Food">;
type Review = Tables<"Review">;

export default function FoodList({
  foods,
  reviewsByFoodId,
  currentUserId,
}: {
  foods: Food[];
  reviewsByFoodId: Record<number, Review[]>;
  currentUserId: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          reviews={reviewsByFoodId[food.id] || []}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

