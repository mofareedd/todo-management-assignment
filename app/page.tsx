import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Example check for authentication (adjust based on your logic)
  const isAuthenticated = await auth();

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
