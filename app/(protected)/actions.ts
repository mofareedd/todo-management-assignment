"use server";

import { TodoSchemaInput } from "@/schemas";
import { db } from "@/server/db";
import {
  taskAssignments,
  tasksTable,
  TaskWithUser,
  usersTable,
} from "@/server/db/schema";
import { and, desc, eq, max, not, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodos(id: string): Promise<TaskWithUser[]> {
  return await db.query.tasksTable.findMany({
    with: {
      author: true,
      assigned: {
        with: {
          user: true,
        },
      },
    },
    orderBy: desc(tasksTable.order),
  });
}

export async function createTodo(input: TodoSchemaInput, userIds: string[]) {
  const [{ maxOrder }] = await db
    .select({ maxOrder: max(tasksTable.order) })
    .from(tasksTable);
  const [newTask] = await db
    .insert(tasksTable)
    .values({ ...input, order: (maxOrder ?? 0) + 1 })
    .returning();

  if (!newTask) {
    throw new Error("Failed to create a task");
  }

  await assignUsersToTask(newTask.id, userIds);

  revalidatePath("/dashboard");
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

export async function getAllUsers(currentUserId: string) {
  return await db.query.usersTable.findMany({
    where: not(eq(usersTable.id, currentUserId)),
  });
}

export async function assignUsersToTask(taskId: string, userIds: string[]) {
  // First, delete existing assignments for the task

  await db.delete(taskAssignments).where(eq(taskAssignments.task_id, taskId));

  const assignments = userIds.map((userId) => ({
    task_id: taskId,
    user_id: userId,
  }));

  return await db.insert(taskAssignments).values(assignments);
}
