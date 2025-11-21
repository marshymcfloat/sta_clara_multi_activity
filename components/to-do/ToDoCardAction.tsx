"use client";

import { Button } from "../ui/button";
import { Edit, Ellipsis, LoaderCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteTaskAction } from "@/lib/actions/taskActionts";
import { toast } from "sonner";
import { queryClient } from "../providers/TanstackProvider";
import { useRouter } from "next/navigation";
import TaskForm from "./TaskForm";
import { Tables } from "@/types/supabase";
import { CreateTaskTypes } from "@/lib/zod schemas/taskSchemas";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
interface ToDoCardActionProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  task: Tables<"Task">;
}

export default function ToDoCardAction({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  task,
}: ToDoCardActionProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const router = useRouter();

  const { mutate: deleteTask, isPending: deletePending } = useMutation({
    mutationFn: deleteTaskAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.refresh();
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            className="absolute top-2 right-2"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsFormVisible(true);
            }}
          >
            <Edit />
            Update
          </DropdownMenuItem>

          <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                onSuccess={() => {
                  setIsFormVisible(false);
                }}
                taskId={task.id}
                initialData={task as CreateTaskTypes}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-red-500 hover:text-red-600!"
                onSelect={(e) => {
                  e.preventDefault();
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 color="red" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your task and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/70"
                  disabled={deletePending}
                  onClick={() => deleteTask(task.id)}
                >
                  {deletePending ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
