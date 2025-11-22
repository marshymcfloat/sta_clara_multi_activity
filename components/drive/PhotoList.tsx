import PhotoCard from "./PhotoCard";
import { Tables } from "@/types/supabase";

type Photo = Tables<"Photo">;

export default function PhotoList({
  photos,
  currentUserId,
}: {
  photos: Photo[];
  currentUserId: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
