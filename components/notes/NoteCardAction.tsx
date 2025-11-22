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
import { deleteNoteAction } from "@/lib/actions/noteActions";
import { toast } from "sonner";
import { queryClient } from "../providers/TanstackProvider";
import { useRouter } from "next/navigation";
import NoteForm from "./NoteForm";
import { Tables } from "@/types/supabase";
import { CreateNoteTypes } from "@/lib/zod schemas/noteSchemas";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface NoteCardActionProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  note: Tables<"Note">;
}

export default function NoteCardAction({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  note,
}: NoteCardActionProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const router = useRouter();

  const { mutate: deleteNote, isPending: deletePending } = useMutation({
    mutationFn: deleteNoteAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
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
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsFormVisible(true);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Edit />
            Update
          </DropdownMenuItem>

          <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Note</DialogTitle>
              </DialogHeader>
              <NoteForm
                onSuccess={() => {
                  setIsFormVisible(false);
                }}
                noteId={note.id}
                initialData={note as CreateNoteTypes}
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
                onClick={(e) => e.stopPropagation()}
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
                  your note and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/70"
                  disabled={deletePending}
                  onClick={() => deleteNote(note.id)}
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
