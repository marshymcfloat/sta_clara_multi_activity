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
import NoteForm from "./NoteForm";
import { useState } from "react";

export default function AddNoteButton() {
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
          <DialogTitle>Add new note</DialogTitle>
        </DialogHeader>
        <NoteForm
          onSuccess={() => {
            setIsFormVisible(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

