"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function UserSignout() {
  return (
    <Button
      onClick={() => {
        signOut().then(() => {
          window.location.reload();
        });
      }}
    >
      Signout
    </Button>
  );
}
