import { z } from "zod";

// Schema for login request validation
export const loginSchema = z.object({
    username: z
        .string({ message: "Username is required" })
        .nonempty({ message: "Username cannot be empty" })
        .min(1, "Username is required"),
    password: z
        .string({ message: "Password is required" })
        .nonempty({ message: "Password cannot be empty" })
        .min(8, "Password must be at least 8 characters long"),
    email: z
        .string({ message: "Email is required" })
        .nonempty({ message: "Email cannot be empty" })
        .email({ message: "Invalid email address" }),
});

// Extract the TypeScript type from the Zod schema for use in request validation
export type LoginRequest = z.infer<typeof loginSchema>;