"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { SignupSchemaInput } from "./_components/signup-form";
import { usersTable } from "@/server/db/schema";
import { getUserByEmail } from "@/lib/auth";
import { LoginSchemaInput } from "@/schemas";
import { signIn } from "@/server/auth";
import { DEFAULT_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export async function createAccount(input: SignupSchemaInput) {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const existinguser = await getUserByEmail(input.email);

  if (existinguser) {
    return { error: "Email is already in use!" };
  }
  await db.insert(usersTable).values({
    ...input,
    password: hashedPassword,
  });

  return { success: "Account created!" };
}

export async function login(input: LoginSchemaInput) {
  try {
    const { email, password } = input;
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });

    return { success: "Logged In Successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
