"use server";

import { TodoSchemaInput } from "@/schemas";
import { db } from "@/server/db";
import { tasksTable } from "@/server/db/schema";
import { and, eq, not, sql } from "drizzle-orm";

export async function getTodos(id: string) {
  try {
    const todos = await db.query.tasksTable.findMany({
      where: and(
        eq(tasksTable.createdById, id),
        eq(sql`DATE(${tasksTable.createdAt})`, sql`CURRENT_DATE`)
      ),
    });

    return todos;
  } catch (e: any) {
    return [];
  }
}

export async function createTodo(input: TodoSchemaInput) {
  const newTodo = await db.insert(tasksTable).values(input).returning();

  return newTodo[0];

  // revalidatePath("/dashboard");
}
export async function deleteTodo(id: string) {
  return await db.delete(tasksTable).where(eq(tasksTable.id, id));
}

export async function taskToggle(id: string) {
  return await db
    .update(tasksTable)
    .set({ completed: not(tasksTable.completed) })
    .where(eq(tasksTable.id, id));
}
