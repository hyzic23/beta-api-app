import { NextResponse } from "next/server";

// Dummy user data for demonstration purposes
const DUMMY_USERS = [
  { id: 1, username: "john_doe", password: "password1", email: "johndoe@example.com", name: "John Doe", role: "admin" },
  { id: 2, username: "demo_user", password: "password2", email: "demouser@example.com", name: "Demo User", role: "user" },
];

export async function POST(request) {
    try{
        const body = await request.json();
        const { username, password } = body;

        // validate the username and password against the dummy user data
        if(!username || !password) {
            return NextResponse.json(
                { message: "Username and password are required." },
                { status: 400 }
            );
        }

        // Find the user in the dummy data
        const user = DUMMY_USERS.find(
            (user) => user.username === username && user.password === password
        );

        // Check if the user exists and return appropriate response
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials.' },
                { status: 401 }
            );
        }

        // Return user data (excluding password) on successful login
        const { password: _, ...userData } = user; // Exclude password from the response
        return NextResponse.json(
            {
                message: 'Login successful.',
                token: 'dummy-jwt-token-xyz789', // Replace with real JWT sign logic in production
                user: userData },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'An error occurred while processing the request.' },
            { status: 500 }
        );
    }
}