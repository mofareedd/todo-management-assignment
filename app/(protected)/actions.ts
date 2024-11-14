"use server";

import { TodoSchemaInput } from "@/schemas";
import { db } from "@/server/db";
import { tasksTable } from "@/server/db/schema";
import { and, desc, eq, max, not, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodos(id: string) {
  try {
    return await db
      .select()
      .from(tasksTable)
      .where(
        and(
          eq(tasksTable.createdById, id),
          eq(sql`DATE(${tasksTable.createdAt})`, sql`CURRENT_DATE`)
        )
      )
      .orderBy(desc(tasksTable.order));
  } catch (e: any) {
    return [];
  }
}

export async function createTodo(input: TodoSchemaInput) {
  const [{ maxOrder }] = await db
    .select({ maxOrder: max(tasksTable.order) })
    .from(tasksTable);
  return await db
    .insert(tasksTable)
    .values({ ...input, order: (maxOrder ?? 0) + 1 });

  // revalidatePath("/dashboard");
}
export async function deleteTodo(id: string) {
  await db.delete(tasksTable).where(eq(tasksTable.id, id));
  revalidatePath("/dashboard");
}

export async function taskToggle(id: string) {
  await db
    .update(tasksTable)
    .set({ completed: not(tasksTable.completed) })
    .where(eq(tasksTable.id, id));
  revalidatePath("/dashboard");
}

export async function swapTasksAction(
  sourceTaskId: string,
  destinationTaskId: string
) {
  // Fetch the order values for the source and destination tasks
  const tasksData = await db
    .select({
      id: tasksTable.id,
      order: tasksTable.order,
    })
    .from(tasksTable)
    .where(
      or(eq(tasksTable.id, sourceTaskId), eq(tasksTable.id, destinationTaskId))
    );

  const taskMap = new Map(tasksData.map((task) => [task.id, task.order]));

  // Validate that both tasks exist
  if (!taskMap.has(sourceTaskId) || !taskMap.has(destinationTaskId)) {
    throw new Error("One or both tasks not found.");
  }

  const sourceOrder = taskMap.get(sourceTaskId)!;
  const destinationOrder = taskMap.get(destinationTaskId)!;

  // Swap the order values of the source and destination tasks
  await db
    .update(tasksTable)
    .set({ order: destinationOrder })
    .where(eq(tasksTable.id, sourceTaskId));

  await db
    .update(tasksTable)
    .set({ order: sourceOrder })
    .where(eq(tasksTable.id, destinationTaskId));

  revalidatePath("/dashboard");
}
