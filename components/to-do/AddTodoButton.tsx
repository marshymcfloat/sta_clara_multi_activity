"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import TaskForm from "./TaskForm";
import { useState } from "react";

export default function AddTodoButton() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  return (
    <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
      <DialogTrigger asChild>
        <Button
          size={"icon-lg"}
          variant={"outline"}
          className="cursor-pointer absolute bottom-4 right-4 rounded-full"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new thing to do</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSuccess={() => {
            setIsFormVisible(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
