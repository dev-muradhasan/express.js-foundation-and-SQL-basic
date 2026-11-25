export interface IUser {
    name: string,
    email: string,
    password: string,
    role?: string,
    age?: number | null,
    is_Active?: boolean
}