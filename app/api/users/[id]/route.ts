import { NextResponse } from "next/server";

// Dummy user database (shared structure)
const DUMMY_USERS = [
    {
        id: 'usr_123',
        email: 'user@example.com',
        name: 'Jane Doe',
        role: 'admin',
        createdAt: '2026-01-15T08:30:00Z',
    },
    {
        id: 'usr_456',
        email: 'john@example.com',
        name: 'John Smith',
        role: 'user',
        createdAt: '2026-03-22T10:15:00Z',
    },
];

interface Context {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: Request, context: Context) {
    try{
        //Await the params from the context
        const { id } = await context.params;

        // Find the user by ID in the dummy data
        const user = DUMMY_USERS.find((user) => user.id === id);

        if (!user) {
            return NextResponse.json(
                { message: `User with ID '${id}' not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User retrieved successfully', user },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}