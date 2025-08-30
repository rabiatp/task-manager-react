import { http } from "./http";

export type Role = "CHILD" | "TEEN";
export type Child = {
    id: string;
    name: string;
    email: string;
    birthdate: string;     // ISO "YYYY-MM-DD"
    role: Role;
    parentId: string;
    createdAt?: string;
};

export type UpdateChild = Partial<Pick<Child, "name" | "email" | "birthdate" | "role">>;

export async function getChildren(): Promise<Child[]> {
    const { data } = await http.get<Child[]>("users/children");
    return data;
}

export async function getChild(id: string): Promise<Child> {
    const { data } = await http.get<Child>(`users/children/${id}`)
    return data;
}

export async function updateChild(id: string, payload: UpdateChild): Promise<Child> {
    const { data } = await http.patch<Child>(`/users/children/${id}`, payload);
    return data;
}

export async function deleteChild(id: string): Promise<void> {
    await http.delete(`/users/children/${id}`);
}