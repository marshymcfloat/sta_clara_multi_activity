import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import PhotoActionButton from "./PhotoActionButton";

import { Tables } from "@/types/supabase";

type Photo = Tables<"Photo">;

export default function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer py-0">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square overflow-hidden bg-muted ">
          <Image
            src={photo.url}
            alt={photo.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      <CardContent className="p-2.5 space-y-1 relative">
        <PhotoActionButton photo={photo} />
        <CardTitle className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {photo.name}
        </CardTitle>
        <CardDescription className="text-[10px] text-muted-foreground">
          {new Date(photo.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
