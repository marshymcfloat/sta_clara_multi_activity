import AddNoteButton from "@/components/notes/AddNoteButton";
import NotesDataContainer from "@/components/notes/NotesDataContainer";
import React, { Suspense } from "react";

export default async function NotesPage() {
  return (
    <div className=" flex-1 p-4">
      <AddNoteButton />
      <Suspense fallback={<h1>Loading...</h1>}>
        <NotesDataContainer />
      </Suspense>
    </div>
  );
}

