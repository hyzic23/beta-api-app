// Request payload for login endpoint
export interface LoginRequest {
    username: string;
    password: string;
}

// User object returned after successful login
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: "admin" | "user" | "guest";
}

// API Response models
export interface LoginResponse {
    //success: boolean;
    message: string;
    token: string; // JWT token for authenticated sessions
    user?: UserProfile; // Optional, present only on successful login
}

// Error response model
export interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>; // Optional field for validation errors
}

export type LoginApiResponse = LoginResponse | ErrorResponse;