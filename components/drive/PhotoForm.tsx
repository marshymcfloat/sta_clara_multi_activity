"use client";

import {
  uploadPhotoClientSchema,
  updateUploadPhotoSchema,
  UploadPhotoClientTypes,
  UpdateUploadPhotoClientTypes,
} from "@/lib/zod schemas/photoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import UploadPhotoInput from "./UploadPhotoInput";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  uploadPhotoAction,
  updatePhotoAction,
} from "@/lib/actions/photoActionts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Tables } from "@/types/supabase";

type Photo = Tables<"Photo">;

export default function PhotoForm({
  photo,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: {
  photo?: Photo | null;
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
}) {
  const router = useRouter();
  const isEditMode = !!photo;

  const form = useForm<UploadPhotoClientTypes | UpdateUploadPhotoClientTypes>({
    resolver: zodResolver(
      isEditMode ? updateUploadPhotoSchema : uploadPhotoClientSchema
    ),
    defaultValues: {
      title: photo?.name || "",
      file: undefined,
    },
  });

  const { mutate: uploadPhoto, isPending: isUploading } = useMutation({
    mutationFn: uploadPhotoAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to upload photo");
        return;
      }
      toast.success(data.message || "Photo uploaded successfully");
      form.reset();
      if (!isEditMode) {
        router.refresh();
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload photo");
    },
  });

  const { mutate: updatePhoto, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) => updatePhotoAction(photo!.id, formData),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to update photo");
        setIsSubmitting?.(false);
        return;
      }
      toast.success(data.message || "Photo updated successfully");
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update photo");
      setIsSubmitting?.(false);
    },
  });

  const handleSubmit = (
    data: UploadPhotoClientTypes | UpdateUploadPhotoClientTypes
  ) => {
    if (isEditMode) {
      setIsSubmitting?.(true);
      const updateFormData = new FormData();
      if (data.title) updateFormData.append("title", data.title);
      if (data.file) updateFormData.append("file", data.file);
      updatePhoto(updateFormData);
    } else {
      const uploadFormData = new FormData();
      uploadFormData.append("title", (data as UploadPhotoClientTypes).title);
      uploadFormData.append("file", (data as UploadPhotoClientTypes).file);
      uploadPhoto(uploadFormData);
    }
  };

  const isPending = isUploading || isUpdating || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo {isEditMode && "(optional)"}</FormLabel>
              <FormControl>
                <UploadPhotoInput
                  value={field.value}
                  onChange={field.onChange}
                  existingImageUrl={photo?.url}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter photo title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-8">
          <Button type="submit" disabled={isPending}>
            {isPending && (
              <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
            )}
            {isEditMode ? "Update Photo" : "Upload Photo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
