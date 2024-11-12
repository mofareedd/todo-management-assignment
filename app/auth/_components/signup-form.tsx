"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createAccount } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  name: z
    .string({ message: "name is required" })
    .min(2, "must contain at least 2 characters")
    .max(50),
  email: z.string({ message: "email is required" }).email("email is not valid"),
  password: z
    .string({ message: "password is required" })
    .min(6, "password must contain at least 6 characters")
    .max(30),
});

export type SignupSchemaInput = z.infer<typeof signupSchema>;
export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<SignupSchemaInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "Mohamed Fareed",
      email: "m.fareeed1997@gmail.com",
      password: "1234567",
    },
  });

  async function onSubmit(values: SignupSchemaInput) {
    startTransition(() => {
      createAccount(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success(data.success);
            router.push("/auth/login");
          }
        })
        .catch((e) => {
          toast.error(e);
        });
    });
  }

  return (
    <Card className="mx-auto w-[576px] border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-4xl font-normal">Signup</CardTitle>
        <CardDescription>Signup and start using app</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex items-center border rounded overflow-hidden space-y-0">
                  <FormLabel className="px-3 py-2 text-sm text-gray-600 w-24 border-r bg-gray-50">
                    Name
                  </FormLabel>
                  <FormControl className="border-none  outline-none flex-1">
                    <Input placeholder="Mohamed Fareed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex items-center border rounded overflow-hidden space-y-0">
                  <FormLabel className="px-3 py-2 text-sm text-gray-600 w-24 border-r bg-gray-50">
                    Email
                  </FormLabel>
                  <FormControl className="border-none  outline-none flex-1">
                    <Input placeholder="cameron@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex items-center border rounded overflow-hidden space-y-0">
                  <FormLabel className="px-3 py-2 text-sm text-gray-600 w-24 border-r bg-gray-50">
                    Password
                  </FormLabel>
                  <FormControl className="border-none  outline-none flex-1">
                    <Input type="password" placeholder="*********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-[#1a1c37] hover:bg-[#1a1c37]/90 font-bold"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Create an account"}
            </Button>
            <div className="">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
