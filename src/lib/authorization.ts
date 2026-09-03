import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_key_change_in_production'
);

export interface TokenPayload {
    userId: string;
    email: string;
    role: 'admin' | 'user';
}

// Generate JWT Token (Authentication)
export async function createToken(payload: TokenPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('2h') // Token expires in 2 hours
        .sign(SECRET_KEY);
}

// Verify JWT Tokenfrom Request (Authentication)
export async function verifyAuth(request: Request): Promise<TokenPayload | null> {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null; // No Authorization header present or invalid format
    }

    //const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload as unknown as TokenPayload;
    } catch (error) {
        return null; // Invalid token or expired token
    }
}

// Helper to enforce specific Roles (Authorization)
export function isAuthorized(
    userRole: string,
    allowRoles: Array<'admin' | 'user'>
): boolean {
    return allowRoles.includes(userRole as 'admin' | 'user');
}