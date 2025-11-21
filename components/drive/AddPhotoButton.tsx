"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import PhotoForm from "./PhotoForm";

export default function AddPhotoButton() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
      <DialogTrigger asChild>
        <Button
          size={"icon-lg"}
          variant={"outline"}
          className="cursor-pointer absolute bottom-4 right-4 rounded-full"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
        </DialogHeader>
        <PhotoForm
          onSuccess={() => {
            setIsFormVisible(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
