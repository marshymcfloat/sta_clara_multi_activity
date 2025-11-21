import PhotoCard from "./PhotoCard";
import { Tables } from "@/types/supabase";

type Photo = Tables<"Photo">;

export default function PhotoList({ photos }: { photos: Photo[] }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
