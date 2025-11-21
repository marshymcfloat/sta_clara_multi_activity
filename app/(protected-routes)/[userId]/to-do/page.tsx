import AddTodoButton from "@/components/to-do/AddTodoButton";
import ToDoListDataContainer from "@/components/to-do/ToDoListDataContainer";
import React, { Suspense } from "react";

export default async function TodoPage() {
  return (
    <div className=" flex-1 p-4">
      <AddTodoButton />
      <Suspense fallback={<h1>Loading...</h1>}>
        <ToDoListDataContainer />
      </Suspense>
    </div>
  );
}
