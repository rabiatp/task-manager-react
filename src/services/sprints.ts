import { http } from "./http";

export type Sprint = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
};

export async function listSprints(): Promise<Sprint[]> {
    const { data } = await http.get<Sprint[]>("/sprints");
    return data;
}
