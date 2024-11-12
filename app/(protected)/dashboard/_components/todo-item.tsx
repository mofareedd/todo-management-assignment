import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskType } from "@/server/db/schema";
import { useTransition } from "react";
import { deleteTodo } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  async function onDelete(id: number) {
    startTransition(async () => {
      await deleteTodo(id);

      router.refresh();
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
          <Checkbox id="terms" className="" />
          <span className="px-2">{todo.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
