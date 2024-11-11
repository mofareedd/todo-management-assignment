import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/server/auth";
import React from "react";
import UserSignout from "./_components/user-signout";

export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <p>Home Page</p>
      <UserSignout />
    </div>
  );
}
