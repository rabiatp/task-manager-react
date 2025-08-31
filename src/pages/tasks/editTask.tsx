import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskEditor from "./taskEditor";
import {
  getTask,
  updateTask,
  type CreateTaskInput,
  type Task,
} from "../../services/tasks";

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("Invalid id");
        const data = await getTask(id);
        setTask(data);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || "Failed to load task."
        );
      }
    })();
  }, [id]);

  const onSubmit = async (payload: CreateTaskInput) => {
    if (!id) return;
    await updateTask(id, payload);
    navigate("/tasks", { replace: true });
  };

  return (
    <div className="app-container">
      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}
      {!err && !task && <div className="card">Loading…</div>}
      {task && (
        <TaskEditor title="Edit Task" initial={task} onSubmit={onSubmit} />
      )}
    </div>
  );
}
