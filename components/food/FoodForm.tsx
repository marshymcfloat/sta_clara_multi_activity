"use client";

import {
  uploadFoodClientSchema,
  updateUploadFoodSchema,
  UploadFoodClientTypes,
  UpdateUploadFoodClientTypes,
} from "@/lib/zod schemas/foodSchema";
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
import UploadPhotoInput from "../drive/UploadPhotoInput";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { uploadFoodAction, updateFoodAction } from "@/lib/actions/foodActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Tables } from "@/types/supabase";

type Food = Tables<"Food">;

export default function FoodForm({
  food,
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: {
  food?: Food | null;
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
}) {
  const router = useRouter();
  const isEditMode = !!food;

  const form = useForm<UploadFoodClientTypes | UpdateUploadFoodClientTypes>({
    resolver: zodResolver(
      isEditMode ? updateUploadFoodSchema : uploadFoodClientSchema
    ),
    defaultValues: {
      title: food?.name || "",
      file: undefined,
    },
  });

  const { mutate: uploadFood, isPending: isUploading } = useMutation({
    mutationFn: uploadFoodAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to upload food photo");
        return;
      }
      toast.success(data.message || "Food photo uploaded successfully");
      form.reset();
      if (!isEditMode) {
        router.refresh();
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload food photo");
    },
  });

  const { mutate: updateFood, isPending: isUpdating } = useMutation({
    mutationFn: (formData: FormData) => updateFoodAction(food!.id, formData),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to update food photo");
        setIsSubmitting?.(false);
        return;
      }
      toast.success(data.message || "Food photo updated successfully");
      router.refresh();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update food photo");
      setIsSubmitting?.(false);
    },
  });

  const handleSubmit = (
    data: UploadFoodClientTypes | UpdateUploadFoodClientTypes
  ) => {
    if (isEditMode) {
      setIsSubmitting?.(true);
      const updateFormData = new FormData();
      if (data.title) updateFormData.append("title", data.title);
      if (data.file) updateFormData.append("file", data.file);
      updateFood(updateFormData);
    } else {
      const uploadFormData = new FormData();
      uploadFormData.append("title", (data as UploadFoodClientTypes).title);
      uploadFormData.append("file", (data as UploadFoodClientTypes).file);
      uploadFood(uploadFormData);
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
              <FormLabel>Food Photo {isEditMode && "(optional)"}</FormLabel>
              <FormControl>
                <UploadPhotoInput
                  value={field.value}
                  onChange={field.onChange}
                  existingImageUrl={food?.url!}
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
                <Input placeholder="Enter food name" {...field} />
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
            {isEditMode ? "Update Food" : "Upload Food"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
