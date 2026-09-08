import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Extract token from Authorization header or HTTP-only cookie
    let token: string | null = null;

    const authHeader = request.headers.get("Authorization");
    console.log('Authorization Header:', authHeader);
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        console.log('Token extracted from Authorization header:', token);
    } else {
        // Check for token in cookies
        token = request.cookies.get("token")?.value || null;
    }

    // Reject request if no token is provided
    if (!token) {
        return NextResponse.json(
            { message: "Unauthorized: No token provided." },
            { status: 401 }
        );
    }

    //Verify JWT signature and expiration
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        console.log('Decoded JWT payload:', payload);

        // (Optional) Check Admin role for specific routes
        if (pathname.startsWith('/api/admin')) {
        if (payload.role !== 'admin') {
            return NextResponse.json(
            { message: 'Forbidden: Admin privilege required' },
            { status: 403 }
            );
        }
    }

    // Pass decoded user metadata to downstream route handlers via custom request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-Id", payload.email as string);
    requestHeaders.set("x-user-role", payload.role as string);

        // Continue to the requested API route with injected headers
    return NextResponse.next({
        request: {
        headers: requestHeaders,
        },
    });
    }catch (error) {
        return NextResponse.json(
        { message: 'Unauthorized: Invalid or expired token' },
        { status: 401 }
        );
    }
}

// ====================================================================
// MATCHER CONFIGURATION
// Define exactly which API routes trigger this middleware
// ====================================================================
export const config = {
    matcher: [
        /*
        * Match all API routes EXCEPT public ones:
        * - /api/login (Authentication endpoint)
        * - /api/register (Registration endpoint)
        * - /api/public/* (Any public endpoints)
        */
        '/api/users/:path*',
        '/api/admin/:path*',
        '/api/dashboard/:path*',
    ],
};