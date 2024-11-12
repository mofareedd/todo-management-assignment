import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskType } from "@/server/db/schema";
import { useTransition } from "react";
import { deleteTodo, taskToggle } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TodoItem({
  todo,
  isOverlay = false,
}: {
  todo: TaskType;
  isOverlay?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  function onDelete(id: string) {
    startTransition(() => {
      deleteTodo(id).then(() => {
        router.refresh();
      });
    });
  }

  async function taskToggleHandler(id: string) {
    startTransition(() => {
      taskToggle(id).then(() => {
        router.refresh();
        toast.success(
          todo.completed
            ? "Updated the task to be uncompleted"
            : "Updated the task to be completed"
        );
      });
    });
  }
  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant={"ghost"} {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-gray-400" />
          </Button>
          <Checkbox
            disabled={isPending}
            id="terms"
            className=""
            checked={!!todo.completed}
            onCheckedChange={(checked) => {
              taskToggleHandler(todo.id);
            }}
          />
          <span className={cn("px-2", todo.completed ? "line-through" : "")}>
            {todo.name}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          disabled={isPending}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function TodoItemLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-9 rounded-md" />{" "}
          <Skeleton className="h-4 w-4 rounded" />{" "}
          <Skeleton className="h-4 w-32" />{" "}
        </div>
        <Skeleton className="h-9 w-9 rounded-md" />{" "}
      </CardContent>
    </Card>
  );
}
