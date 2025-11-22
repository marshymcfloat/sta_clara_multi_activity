import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function FoodListSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="overflow-hidden py-0">
          <CardHeader className="p-0">
            <div className="relative w-full aspect-square overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </CardHeader>
          <CardContent className="p-2.5 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

