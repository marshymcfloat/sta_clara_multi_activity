import AddPhotoButton from "@/components/drive/AddPhotoButton";
import PhotosDataContainer from "@/components/drive/PhotosDataContainer";
import { Suspense } from "react";

export default function page() {
  return (
    <main className="flex-1  p-4">
      <AddPhotoButton />
      <Suspense fallback={<h1>Loading...</h1>}>
        <PhotosDataContainer />
      </Suspense>
    </main>
  );
}
