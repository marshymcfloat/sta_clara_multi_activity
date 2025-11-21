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
    <div className="grid grid-cols-6 gap-4">
      {notes.map((note) => (
        <NoteCard note={note} key={note.id} />
      ))}
    </div>
  );
}

