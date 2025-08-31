import { useNavigate } from "react-router-dom";
import SprintEditor from "./sprintEditor";
import { createSprint, type CreateSprintInput } from "../../services/sprints";

export default function NewSprint() {
  const navigate = useNavigate();
  const onSubmit = async (payload: CreateSprintInput) => {
    await createSprint(payload);
    navigate("/sprints", { replace: true });
  };
  return (
    <div className="app-container">
      <SprintEditor title="New Sprint" onSubmit={onSubmit} />
    </div>
  );
}
