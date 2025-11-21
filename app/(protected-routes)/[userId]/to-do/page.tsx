import AddTodoButton from "@/components/to-do/AddTodoButton";
import { Card } from "@/components/ui/card";
import ToDoListDataContainer from "@/components/to-do/ToDoListDataContainer";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function TodoPage() {
  return (
    <div className=" flex-1 p-4">
      <AddTodoButton />
      <ToDoListDataContainer />
    </div>
  );
}
