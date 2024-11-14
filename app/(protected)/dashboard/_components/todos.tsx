"use client";
import { useOptimistic, useTransition } from "react";
import dayjs from "dayjs";
import { GripVertical, LayoutGrid, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTodo } from "./create-todo";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";

import { User } from "next-auth";
import { TaskType } from "@/server/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { deleteTodo, swapTasksAction, taskToggle } from "../../actions";
import { toast } from "sonner";

interface TodosProps {
  currentUser: User;
  tasks: TaskType[];
}
export default function Todos({ tasks, currentUser }: TodosProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, swapOptimistic] = useOptimistic(
    tasks,
    (state, { sourceTaskId, destinationTaskId }) => {
      const sourceIndex = state.findIndex((task) => task.id === sourceTaskId);
      const destinationIndex = state.findIndex(
        (task) => task.id === destinationTaskId
      );

      const newState = [...state];
      newState[sourceIndex] = state[destinationIndex];
      newState[destinationIndex] = state[sourceIndex];

      return newState;
    }
  );

  const onDragEnd = async (result: DropResult) => {
    const sourceTaskId = result.draggableId;
    const destinationTaskId = tasks[result.destination!.index].id;
    startTransition(() => {
      swapOptimistic({ sourceTaskId, destinationTaskId });
    });
    await swapTasksAction(sourceTaskId, destinationTaskId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="">
          <h2 className="text-4xl font-bold">
            Good Evening, {currentUser.name} 🤩
          </h2>
          <p className="text-muted-foreground">
            {"It's"} {dayjs().format("dddd, D MMMM YYYY")}
          </p>
        </div>

        <Button variant={"secondary"}>
          <LayoutGrid fill="" />
        </Button>
      </div>

      <div className="space-y-2">
        <p>🗓️ Today {tasks.length}</p>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={"tasks"}>
            {(droppableProvided) => (
              <ul
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {optimisticState.map((task, idx) => {
                  return (
                    <Draggable draggableId={task.id} key={task.id} index={idx}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                {...provided.dragHandleProps}
                                variant={"ghost"}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </Button>
                              <Checkbox
                                disabled={isPending}
                                id="terms"
                                className=""
                                checked={!!task.completed}
                                onCheckedChange={(checked) => {
                                  startTransition(() => {
                                    taskToggle(task.id).then(() => {
                                      toast.success(
                                        task.completed
                                          ? "Updated the task to be uncompleted"
                                          : "Updated the task to be completed"
                                      );
                                    });
                                  });
                                }}
                              />
                              <span
                                className={cn(
                                  "px-2",
                                  task.completed ? "line-through" : ""
                                )}
                              >
                                {task.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                startTransition(() => {
                                  deleteTodo(task.id);
                                });
                              }}
                              disabled={isPending}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
                {droppableProvided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <CreateTodo currentUser={currentUser} />
      </div>
    </div>
  );
}
