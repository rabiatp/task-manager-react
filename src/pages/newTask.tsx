import { useNavigate } from "react-router-dom";
import TaskEditor from "./taskEditor";
import { createTask, type CreateTaskInput } from "../services/tasks";

export default function NewTask() {
  const navigate = useNavigate();
  const onSubmit = async (payload: CreateTaskInput) => {
    await createTask(payload);
    navigate("/tasks", { replace: true });
  };
  return (
    <div className="app-container">
      <TaskEditor title="New Task" onSubmit={onSubmit} />
    </div>
  );
}
