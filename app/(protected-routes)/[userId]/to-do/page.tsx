import AddTodoButton from "@/components/to-do/AddTodoButton";
import ToDoListDataContainer from "@/components/to-do/ToDoListDataContainer";
import ToDoListSkeleton from "@/components/to-do/ToDoListSkeleton";
import React, { Suspense } from "react";

export default async function TodoPage() {
  return (
    <div className="flex-1 p-2 sm:p-4">
      <AddTodoButton />
      <Suspense fallback={<ToDoListSkeleton />}>
        <ToDoListDataContainer />
      </Suspense>
    </div>
  );
}
