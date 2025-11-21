import AddFoodButton from "@/components/food/AddFoodButton";
import FoodsDataContainer from "@/components/food/FoodsDataContainer";
import { Suspense } from "react";

export default function page() {
  return (
    <main className="flex-1  p-4">
      <AddFoodButton />
      <Suspense fallback={<h1>Loading...</h1>}>
        <FoodsDataContainer />
      </Suspense>
    </main>
  );
}
