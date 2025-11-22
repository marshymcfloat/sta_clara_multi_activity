import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function ToDoListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="w-full sm:w-fit sm:min-w-[300px]">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

