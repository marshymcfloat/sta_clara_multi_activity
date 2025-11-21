"use client";

import {
  uploadPhotoClientSchema,
  UploadPhotoClientTypes,
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
import { uploadPhotoAction } from "@/lib/actions/photoActionts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { queryClient } from "../providers/TanstackProvider";
import { LoaderCircle } from "lucide-react";

export default function PhotoForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();

  const form = useForm<UploadPhotoClientTypes>({
    resolver: zodResolver(uploadPhotoClientSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const { mutate: uploadPhoto, isPending } = useMutation({
    mutationFn: uploadPhotoAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to upload photo");
        return;
      }
      toast.success(data.message || "Photo uploaded successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload photo");
    },
  });

  const handleSubmit = (data: UploadPhotoClientTypes) => {
    const uploadFormData = new FormData();
    uploadFormData.append("title", data.title);
    uploadFormData.append("file", data.file);
    uploadPhoto(uploadFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <UploadPhotoInput
                  value={field.value}
                  onChange={field.onChange}
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
            Upload Photo
          </Button>
        </div>
      </form>
    </Form>
  );
}
