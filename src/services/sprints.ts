import { http } from "./http";

export type Sprint = {
    id: string;
    name: string;
    startDate: string; // "YYYY-MM-DD"
    endDate: string;   // "YYYY-MM-DD"
};

export type CreateSprintInput = Omit<Sprint, "id">;
export type UpdateSprintInput = Partial<CreateSprintInput>;

export async function listSprints(): Promise<Sprint[]> {
    try {
        const { data } = await http.get<Sprint[]>("/sprints");
        return data ?? [];
    } catch (e: any) {
        const s = e?.response?.status;
        if (s === 404 || s === 204) return [];
        throw e;
    }
}

export async function getSprint(id: string): Promise<Sprint> {
    const { data } = await http.get<Sprint>(`/sprints/${id}`);
    return data;
}

export async function createSprint(payload: CreateSprintInput): Promise<Sprint> {
    const { data } = await http.post<Sprint>("/sprints/create", payload);
    debugger
    return data;
}

export async function updateSprint(id: string, payload: UpdateSprintInput): Promise<Sprint> {
    const { data } = await http.patch<Sprint>(`/sprints/${id}`, payload);
    return data;
}

export async function deleteSprint(id: string): Promise<void> {
    await http.delete(`/sprints/${id}`);
}
