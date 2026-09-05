import { NextResponse } from "next/server";
import { loginSchema } from "./schema";
import { LoginResponse, ErrorResponse } from "./auth";
import { createToken } from "@/src/lib/authorization" // Import the createToken function from auth.ts
import * as z from "zod";
import { logger } from "@/src/utils/logger";

// Dummy user data for demonstration purposes
const DUMMY_USERS = [
    {
        id: 1, username:
        "john_doe",
        password: "password1",
        email: "johndoe@example.com",
        name: "John Doe",
        role: "admin" as const
    },
    {
        id: 2,
        username: "demo_user",
        password: "password2",
        email: "demouser@example.com",
        name: "Demo User",
        role: "user" as const
    },
];

export async function POST(request: Request) {
    try{
        const result = loginSchema.safeParse(await request.json());
        logger.info('Login request payload: ', { result });

        if (!result.success) {
            const errors = z.flattenError(result.error).fieldErrors; // Use flattenError to get a more structured error object

            return NextResponse.json<ErrorResponse>(
                {
                    message: 'Invalid request data.', // Validation error message
                    errors: errors
                },
                { status: 400 }
            );
        }

        const { username, password } = result.data; // Extract validated data

        // Find the user in the dummy data
        const user = DUMMY_USERS.find(
            (user) => user.username === username && user.password === password
        );

        // Check if the user exists and return appropriate response
        if (!user) {
            return NextResponse.json<ErrorResponse>(
                { message: 'Invalid credentials.' },
                { status: 401 }
            );
        }

        // Generate JWT token for the authenticated user
        const token = await createToken({
            userId: user.id.toString(),
            email: user.email,
            role: user.role
        });

        // Return user data (excluding password) on successful login
        // NOTE = The _ is used to exclude the password from the user object in the response. This is a common practice to avoid sending sensitive information back to the client.
        const { password: _, ...userData } = user; // Exclude password from the response

        return NextResponse.json<LoginResponse>(
            {
                message: 'Login successful.',
                token,  // Return Bearer token to client
                //...userData,
                user: userData
            },
            { status: 200 }
        );

    } catch (error) {
        //logger.error('Login failed with internal error', { error });
        return NextResponse.json<ErrorResponse>(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}