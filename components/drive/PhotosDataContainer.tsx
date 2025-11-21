import React from "react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PhotoListClient from "./PhotoListClient";
import { Tables } from "@/types/supabase";

export default async function PhotosDataContainer() {
  const supabase = await createClient(cookies());

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/");
  }

  const { data: photos, error: photosError } = await supabase
    .from("Photo")
    .select("*")
    .order("created_at", { ascending: false });

  if (photosError) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <h1 className="text-2xl font-bold">Error fetching photos</h1>
        <p className="text-sm text-gray-500">{photosError.message}</p>
      </div>
    );
  }

  return <PhotoListClient photos={photos || []} />;
}
