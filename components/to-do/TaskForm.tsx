import {
  createTaskSchema,
  CreateTaskTypes,
} from "@/lib/zod schemas/taskSchemas";
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
import { createTaskAction, updateTaskAction } from "@/lib/actions/taskActionts";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { queryClient } from "../providers/TanstackProvider";
export default function TaskForm({
  initialData,
  taskId,
  onSuccess,
}: {
  initialData?: CreateTaskTypes;
  taskId?: number;
  onSuccess: () => void;
}) {
  const router = useRouter();

  const form = useForm<CreateTaskTypes>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
    },
  });

  const formInputs = Object.keys(form.getValues()) as (keyof CreateTaskTypes)[];

  const { mutate: addTaskMutate, isPending: addTaskPending } = useMutation({
    mutationFn: createTaskAction,
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.error);
        return;
      }
      toast.success(data?.message || "Task created successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess();
    },
  });

  const { mutate: updateTaskMutate, isPending: updateTaskPending } =
    useMutation({
      mutationFn: ({
        types,
        taskId,
      }: {
        types: CreateTaskTypes;
        taskId: number;
      }) => updateTaskAction(types, taskId),
      onSuccess: (data) => {
        if (!data?.success) {
          toast.error(data?.error);
          return;
        }
        toast.success(data?.message || "Task updated successfully");
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        onSuccess();
      },
    });

  function handleSubmission(types: CreateTaskTypes) {
    if (initialData) {
      updateTaskMutate({ types, taskId: taskId! });
    } else {
      addTaskMutate(types);
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
                  {input === "description" && (
                    <span className="text-xs text-muted-foreground">
                      optional
                    </span>
                  )}
                </FormLabel>
                <FormControl>
                  {input === "description" ? (
                    <Textarea
                      {...field}
                      placeholder="etc; add more details here..."
                    />
                  ) : (
                    <Input {...field} placeholder="Add a title for your task" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end mt-8">
          <Button disabled={addTaskPending} type="submit">
            {addTaskPending && (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            )}
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
