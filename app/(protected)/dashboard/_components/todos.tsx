"use client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTodo } from "./create-todo";

import { TodoItem } from "./todo-item";
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
import { createTasksStore, useTasksStore } from "../hooks/useTasks";
interface Todo {
  id: string;
  text: string;
}

interface TodosProps {
  currentUser: User;
  tasks: TaskType[];
}
export default function Todos({ tasks, currentUser }: TodosProps) {
  createTasksStore(tasks);
  const { tasks: todos, moveTask, setTasks } = useTasksStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over?.id || active.id === over.id) return;

    moveTask(active.id, over.id);
  };

  // useEffect(() => {
  //   setTasks(tasks);
  // }, [tasks, setTasks]);

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
            {todos.map((t, index) => {
              return <TodoItem todo={t} key={index} />;
            })}
          </SortableContext>
        </DndContext>
        <CreateTodo currentUser={currentUser} />
      </div>
    </div>
  );
}
