import React from "react";

import { Tables } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import NoteCard from "./NoteCard";

export default function NoteList({ notes }: { notes: Tables<"Note">[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {notes.map((note) => (
        <NoteCard note={note} key={note.id} />
      ))}
    </div>
  );
}

