import { db } from "@/server/db";
import { usersTable } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });

    return user;
  } catch {
    return null;
  }
}
