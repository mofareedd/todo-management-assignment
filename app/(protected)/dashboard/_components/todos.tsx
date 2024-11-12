"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import dayjs from "dayjs";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTodo } from "./create-todo";

import { TodoItem, TodoItemLoading } from "./todo-item";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { User } from "next-auth";
import { TaskType } from "@/server/db/schema";
import { useTasksStore } from "../hooks/useTasks";
import { useIsClient } from "../hooks/useIsClient";
interface Todo {
  id: string;
  text: string;
}

interface TodosProps {
  currentUser: User;
  tasks: TaskType[];
}
export default function Todos({ tasks, currentUser }: TodosProps) {
  const { tasks: todos, moveTask, setTasks } = useTasksStore();
  const isClient = useIsClient();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over?.id || active.id === over.id) return;

    moveTask(active.id, over.id);
  };

  useEffect(() => {
    setTasks(tasks);
  }, [tasks, setTasks]);

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
        <p>🗓️ Today {todos.length}</p>

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos} strategy={verticalListSortingStrategy}>
            {todos.length > 0
              ? todos.map((t, index) => {
                  return <TodoItem todo={t} key={index} />;
                })
              : null}

            {todos.length === 0 && isClient ? (
              <div className="py-4 text-center">
                <p>Not found</p>
              </div>
            ) : null}

            {!isClient
              ? Array.from({ length: 3 })
                  .fill(2)
                  .map((x, i) => {
                    return <TodoItemLoading key={i} />;
                  })
              : null}
          </SortableContext>
        </DndContext>
        <CreateTodo currentUser={currentUser} />
      </div>
    </div>
  );
}
