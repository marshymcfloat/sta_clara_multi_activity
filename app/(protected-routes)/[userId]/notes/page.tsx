import AddNoteButton from "@/components/notes/AddNoteButton";
import NotesDataContainer from "@/components/notes/NotesDataContainer";
import NoteListSkeleton from "@/components/notes/NoteListSkeleton";
import React, { Suspense } from "react";

export default async function NotesPage() {
  return (
    <div className=" flex-1 p-4">
      <AddNoteButton />
      <Suspense fallback={<NoteListSkeleton />}>
        <NotesDataContainer />
      </Suspense>
    </div>
  );
}

