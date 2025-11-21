"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tables } from "@/types/supabase";
import ToDoCardAction from "./ToDoCardAction";
import { useState } from "react";

export default function ToDoCard({ task }: { task: Tables<"Task"> }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <Card className="capitalize w-fit min-w-[300px] relative">
      <CardAction>
        <ToDoCardAction
          task={task}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </CardAction>
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Listed on: {""}
          {new Date(task.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
