import React from "react";

import { Tables } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ToDoCard from "./ToDoCard";
export default function ToDoList({ tasks }: { tasks: Tables<"Task">[] }) {
  return (
    <div className="grid grid-cols-6  gap-4">
      {tasks.map((task) => (
        <ToDoCard task={task} key={task.id} />
      ))}
    </div>
  );
}
