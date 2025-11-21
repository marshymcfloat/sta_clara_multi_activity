import { AuthLoginTypes, authLoginSchema } from "@/lib/zod schemas/authSchemas";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation } from "@tanstack/react-query";
import { authLoginAction } from "@/lib/actions/authActions";
import { toast } from "sonner";
import { LoaderCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthLoginForm({
  setContent,
}: {
  setContent: (content: "LOGIN" | "REGISTER") => void;
}) {
  const router = useRouter();

  const form = useForm<AuthLoginTypes>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formInputs = Object.keys(form.getValues()) as (keyof AuthLoginTypes)[];

  const { mutate: login, isPending } = useMutation({
    mutationFn: authLoginAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "An unexpected error occurred");
        return;
      }
      toast.success(data.message || "Login successful");
      router.push(`/${data.data}/to-do`);
    },
  });

  function handleSubmission(types: AuthLoginTypes) {
    login(types);
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
                    type={input === "password" ? "password" : "text"}
                    placeholder={
                      input === "email" ? "example@example.com" : "********"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex flex-col gap-4 mt-12">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
            Login
          </Button>
          <p className="text-center text-sm">
            Still no account?{" "}
            <span
              className="text-sm font-medium cursor-pointer underline hover:underline-offset-2"
              onClick={() => setContent("REGISTER")}
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </Form>
  );
}
