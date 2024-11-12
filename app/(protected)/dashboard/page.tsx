import React from "react";
import Todos from "./_components/todos";
import { auth } from "@/server/auth";
import { getTodos } from "../actions";
import UserProfile from "@/components/user-profile";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};
export default async function Dashboard() {
  const session = await auth();

  const tasks = await getTodos(session!.user.id);

  return (
    <main className="py-4">
      <div className="flex items-center justify-end px-6">
        <UserProfile user={session!.user} />
      </div>
      <div className="min-h-screen max-w-5xl mx-auto flex flex-col justify-center">
        <Todos currentUser={session!.user!} tasks={tasks} />
      </div>
    </main>
  );
}
