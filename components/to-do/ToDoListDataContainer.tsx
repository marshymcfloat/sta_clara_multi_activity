import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import ToDoList from "./ToDoList";

export default async function ToDoListDataContainer() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("Task")
    .select("*")
    .eq("created_by", user.id);

  if (tasksError) {
    console.error(tasksError);
    return <div>Error loading tasks</div>;
  }

  return <ToDoList tasks={tasks} />;
}
