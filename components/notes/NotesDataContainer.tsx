import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import NoteList from "./NoteList";

export default async function NotesDataContainer() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  const { data: notes, error: notesError } = await supabase
    .from("Note")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (notesError) {
    console.error(notesError);
    return <div>Error loading notes</div>;
  }

  return <NoteList notes={notes} />;
}

