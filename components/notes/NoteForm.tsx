import {
  createNoteSchema,
  CreateNoteTypes,
} from "@/lib/zod schemas/noteSchemas";
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
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { createNoteAction, updateNoteAction } from "@/lib/actions/noteActionts";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { queryClient } from "../providers/TanstackProvider";

export default function NoteForm({
  initialData,
  noteId,
  onSuccess,
}: {
  initialData?: CreateNoteTypes;
  noteId?: number;
  onSuccess: () => void;
}) {
  const router = useRouter();

  const form = useForm<CreateNoteTypes>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
    },
  });

  const formInputs = Object.keys(form.getValues()) as (keyof CreateNoteTypes)[];

  const { mutate: addNoteMutate, isPending: addNotePending } = useMutation({
    mutationFn: createNoteAction,
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.error);
        return;
      }
      toast.success(data?.message || "Note created successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onSuccess();
    },
  });

  const { mutate: updateNoteMutate, isPending: updateNotePending } =
    useMutation({
      mutationFn: ({
        types,
        noteId,
      }: {
        types: CreateNoteTypes;
        noteId: number;
      }) => updateNoteAction(types, noteId),
      onSuccess: (data) => {
        if (!data?.success) {
          toast.error(data?.error);
          return;
        }
        toast.success(data?.message || "Note updated successfully");
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["notes"] });
        onSuccess();
      },
    });

  function handleSubmission(types: CreateNoteTypes) {
    if (initialData) {
      updateNoteMutate({ types, noteId: noteId! });
    } else {
      addNoteMutate(types);
    }
  }

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(handleSubmission)}
        className="space-y-4"
      >
        {formInputs.map((input) => (
          <FormField
            key={input}
            control={form.control}
            name={input}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">
                  {input}{" "}
                  {input === "content" && (
                    <span className="text-xs text-muted-foreground">
                      (Markdown supported)
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  {input === "content" ? (
                    <Textarea
                      {...field}
                      placeholder="Write your note in Markdown..."
                      rows={10}
                      className="font-mono text-sm"
                    />
                  ) : (
                    <Input {...field} placeholder="Add a title for your note" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end mt-8">
          <Button disabled={addNotePending || updateNotePending} type="submit">
            {(addNotePending || updateNotePending) && (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            )}
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

