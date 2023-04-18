export interface IUser {
    role: string;
    id: string;
    email: string;
    department: number;
}

export interface IUserData {
    role: string;
    id: string;
    email: string;
    address?: string;
    phone?: string;
    name?: string;
}