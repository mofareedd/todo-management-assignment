"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { todoSchema, TodoSchemaInput } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Command as CommandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createTodo } from "../../actions";
import { User } from "next-auth";
import { toast } from "sonner";
import { IconSpinner } from "@/components/spinner";
import { UserType } from "@/server/db/schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CreateTodoProps {
  currentUser: User;
  allUsers: UserType[];
}
export function CreateTodo({ currentUser, allUsers = [] }: CreateTodoProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
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
      const usersIds: string[] = selectedUsers.length
        ? selectedUsers.map((u) => u.id)
        : [];

      createTodo(values, usersIds)
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
              <CommandIcon />
            </div>
            <div className="bg-white flex items-center justify-center p-2 w-8 rounded-lg text-xs">
              J
            </div>
          </div>
        </Button>
      </DialogTrigger>
      {/* <DialogContent className="sm:max-w-[425px]"> */}
      <DialogContent className="sm:max-w-[425px] flex flex-col max-h-[90vh]">
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
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
              <CommandInput placeholder="Search user..." />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup className="p-2">
                  {allUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      className="flex items-center px-2"
                      onSelect={() => {
                        setSelectedUsers((current) => {
                          const userIndex = current.findIndex(
                            (selectedUser) => selectedUser.email === user.email
                          );
                          if (userIndex > -1) {
                            // User is already selected, remove them
                            return [
                              ...current.slice(0, userIndex),
                              ...current.slice(userIndex + 1),
                            ];
                          } else {
                            // User is not selected, add them
                            return [...current, user];
                          }
                        });
                      }}
                    >
                      <Avatar>
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {selectedUsers.some(
                        (selectedUser) => selectedUser.id === user.id
                      ) ? (
                        <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>

            <DialogFooter className="grid grid-cols-1 justify-items-center space-y-4 border-t p-4">
              <div className="">
                {selectedUsers.length > 0 ? (
                  <div className="flex -space-x-2 overflow-hidden">
                    {selectedUsers.map((user) => (
                      <Avatar
                        key={user.id}
                        className="inline-block border-2 border-background"
                      >
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select users to add to this task.
                  </p>
                )}
              </div>

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? <IconSpinner /> : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
