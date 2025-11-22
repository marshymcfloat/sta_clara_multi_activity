import AddFoodButton from "@/components/food/AddFoodButton";
import FoodsDataContainer from "@/components/food/FoodsDataContainer";
import FoodListSkeleton from "@/components/food/FoodListSkeleton";
import { Suspense } from "react";

export default function page() {
  return (
    <main className="flex-1  p-4">
      <AddFoodButton />
      <Suspense fallback={<FoodListSkeleton />}>
        <FoodsDataContainer />
      </Suspense>
    </main>
  );
}
