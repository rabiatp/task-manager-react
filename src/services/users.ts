import { http } from "./http";

export type UserRef = { id: string; name: string; email: string };

export async function listUsers(): Promise<UserRef[]> {
    const { data } = await http.get<UserRef[]>("/users");
    return data;
}
