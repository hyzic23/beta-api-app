export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    createdAt: Date;
    updatedAt: Date;
}

// Model for creating a new user
export interface UserCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    age: number;
}

// Model for updating an existing user
export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    age?: number;
}