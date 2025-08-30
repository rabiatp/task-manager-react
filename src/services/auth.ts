import type { LoginForm, User, Role } from "../models/auth";
import { http } from "./http";

export type SignUpForm = {
    name: string;
    email: string;
    password: string;
    birthdate: string;
    role: Role;
    parentId?: string | null;
};
export type AuthPayload = { user: User; token: string };

export async function login(form: LoginForm): Promise<AuthPayload> {
    const { data } = await http.post<AuthPayload>("/auth/login", form);
    return data;
}

export async function signup(form: SignUpForm): Promise<AuthPayload> {
    const { data } = await http.post<AuthPayload>("/auth/register", form);
    return data;
}

export async function logout() {
    localStorage.removeItem("token");
    return Promise.resolve();
}


export async function getMe(token: string): Promise<User> {
    const res = await fetch("http://localhost:3000/users/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Me failed");
    }

    return res.json();


}