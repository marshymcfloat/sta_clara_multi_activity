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
import NoteCardAction from "./NoteCardAction";
import { useState } from "react";
import NoteDetailDialog from "./NoteDetailDialog";

export default function NoteCard({ note }: { note: Tables<"Note"> }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  return (
    <>
      <Card
        className="capitalize w-full sm:w-fit sm:min-w-[300px] relative cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsDetailDialogOpen(true)}
      >
        <CardAction>
          <NoteCardAction
            note={note}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </CardAction>
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Listed on: {""}
            {new Date(note.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription className="whitespace-pre-wrap line-clamp-3">
            {note.content}
          </CardDescription>
        </CardContent>
      </Card>

      <NoteDetailDialog
        note={note}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </>
  );
}
