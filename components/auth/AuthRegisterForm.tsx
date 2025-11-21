import {
  authRegisterSchema,
  AuthRegisterTypes,
} from "@/lib/zod schemas/authSchemas";
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
import { Button } from "../ui/button";
import { LoaderCircle, MoveLeft, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authRegisterAction } from "@/lib/actions/authActions";
import { toast } from "sonner";

export default function AuthRegisterForm({
  setContent,
}: {
  setContent: (content: "LOGIN" | "REGISTER") => void;
}) {
  const form = useForm<AuthRegisterTypes>({
    resolver: zodResolver(authRegisterSchema),
    defaultValues: {
      email: "",
      fullname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const formInputs = Object.keys(
    form.getValues()
  ) as (keyof AuthRegisterTypes)[];

  const { mutate: register, isPending } = useMutation({
    mutationFn: authRegisterAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "An unexpected error occurred");
        return;
      }
      toast.success(data.message || "Account verification sent to your email");
      setContent("LOGIN");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  function handleSubmission(types: AuthRegisterTypes) {
    register(types);
  }

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(handleSubmission)}
        className="space-y-4 "
      >
        {formInputs.map((input) => (
          <FormField
            key={input}
            control={form.control}
            name={input}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">{input}</FormLabel>
                <FormControl>
                  <Input
                    type={
                      input === "email"
                        ? "email"
                        : input === "fullname"
                        ? "text"
                        : "password"
                    }
                    placeholder={
                      input === "email"
                        ? "example@example.com"
                        : input === "fullname"
                        ? "etc. Juan Dela Cruz"
                        : "********"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setContent("LOGIN")}
              disabled={isPending}
            >
              <MoveLeft />
              Back
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <UserPlus />
              )}
              Register
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
