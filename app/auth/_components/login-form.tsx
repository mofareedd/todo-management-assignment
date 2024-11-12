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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createAccount, login } from "../actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { loginSchema, LoginSchemaInput } from "@/schemas";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "m.fareeed1997@gmail.com",
      password: "1234567",
    },
  });

  async function onSubmit(values: LoginSchemaInput) {
    startTransition(async () => {
      const { error, success } = await login(values);
      if (error) {
        toast.error(error);
      }
    });
  }

  return (
    <Card className="mx-auto w-[576px] border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-4xl font-normal">Login</CardTitle>
        <CardDescription>Login and start using app</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              {isPending ? "Logging in..." : "Login"}
            </Button>
            <div className="">
              <Link href="/auth/login" className="text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm ">
              <span>Dont have an acconut? </span>
              <Link href="/auth/signup" className="hover:underline">
                signup?
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
