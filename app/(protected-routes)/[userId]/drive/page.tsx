import AddPhotoButton from "@/components/drive/AddPhotoButton";
import PhotosDataContainer from "@/components/drive/PhotosDataContainer";
import PhotoListSkeleton from "@/components/drive/PhotoListSkeleton";
import { Suspense } from "react";

export default function page() {
  return (
    <main className="flex-1 p-2 sm:p-4">
      <AddPhotoButton />
      <Suspense fallback={<PhotoListSkeleton />}>
        <PhotosDataContainer />
      </Suspense>
    </main>
  );
}
