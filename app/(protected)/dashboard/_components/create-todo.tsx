"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { todoSchema, TodoSchemaInput } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createTodo } from "../../actions";
import { User } from "next-auth";
import { toast } from "sonner";
import { IconSpinner } from "@/components/spinner";

interface CreateTodoProps {
  currentUser: User;
}
export function CreateTodo({ currentUser }: CreateTodoProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<TodoSchemaInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      name: "",
      createdById: currentUser.id,
    },
  });

  async function onSubmit(values: TodoSchemaInput) {
    startTransition(() => {
      createTodo(values)
        .then((data) => {
          setOpen(false);
          router.refresh();
        })
        .catch((e) => {
          toast.error("Failed to create new task");
        });
    });
  }
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-testId="create-todo"
          variant="secondary"
          className="w-full flex items-center justify-between p-5 border-2 border-dashed"
        >
          <div className="flex items-center space-x-4 font-medium">
            <span className="text-xl">+</span>
            <span>New Task</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white flex items-center justify-center p-2 w-8 rounded-lg text-xs">
              <Command />
            </div>
            <div className="bg-white flex items-center justify-center p-2 w-8 rounded-lg text-xs">
              J
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter your task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? <IconSpinner /> : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
