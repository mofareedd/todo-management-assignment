import React from "react";
import Todos from "./_components/todos";
import { auth } from "@/server/auth";
import { getTodos } from "../actions";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();

  const tasks = await getTodos(session!.user.id);

  return (
    <div className="min-h-screen max-w-5xl mx-auto flex flex-col justify-center">
      <Todos currentUser={session!.user!} tasks={tasks} />
    </div>
  );
}
