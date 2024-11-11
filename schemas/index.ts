import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ message: "email is required" }).email("email is not valid"),
  password: z
    .string({ message: "password is required" })
    .min(6, "password must contain at least 6 characters")
    .max(30),
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;
