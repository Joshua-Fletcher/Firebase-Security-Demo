export interface IUser {
    role: string;
    id: string;
    email: string;
}

export interface IUserData {
    role: string;
    id: string;
    email: string;
    address?: string;
    phone?: string;
    name?: string;
}