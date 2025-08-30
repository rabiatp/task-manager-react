import { http } from "./http";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: Priority;
    createdAt?: string;
    updatedAt?: string;

    sprintId: string;
    creatorId: string;

    assignees?: { userId: string }[];
};

export type CreateTaskInput = {
    title: string;
    description?: string;
    sprintId: string;
    priority?: Priority;          // default: MEDIUM
    assigneeIds?: string[];       // optional
};

export type UpdateTaskInput = Partial<CreateTaskInput> & {
    status?: TaskStatus;
};

export async function listTasks(): Promise<Task[]> {
    const { data } = await http.get<Task[]>("/tasks");
    return data;
}

export async function getTask(id: string): Promise<Task> {
    const { data } = await http.get<Task>(`/tasks/${id}`);
    return data;
}

export async function createTask(payload: CreateTaskInput): Promise<Task> {
    const { data } = await http.post<Task>("/tasks", payload);
    return data;
}

export async function updateTask(id: string, payload: UpdateTaskInput): Promise<Task> {
    const { data } = await http.patch<Task>(`/tasks/${id}`, payload);
    return data;
}

export async function deleteTask(id: string): Promise<void> {
    await http.delete(`/tasks/${id}`);
}

/** TODO -> IN_PROGRESS -> DONE -> TODO döngüsü */
export async function toggleStatus(id: string, current: TaskStatus): Promise<Task> {
    const next: TaskStatus =
        current === "TODO" ? "IN_PROGRESS" :
            current === "IN_PROGRESS" ? "DONE" : "TODO";
    return updateTask(id, { status: next });
}
