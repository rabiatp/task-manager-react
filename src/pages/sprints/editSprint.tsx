import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SprintEditor from "./sprintEditor";
import {
  getSprint,
  updateSprint,
  type CreateSprintInput,
  type Sprint,
} from "../../services/sprints";

export default function EditSprint() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("Invalid id");
        const data = await getSprint(id);
        setSprint(data);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || "Failed to load sprint."
        );
      }
    })();
  }, [id]);

  const onSubmit = async (payload: CreateSprintInput) => {
    if (!id) return;
    await updateSprint(id, payload);
    navigate("/sprints", { replace: true });
  };

  return (
    <div className="app-container">
      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}
      {!err && !sprint && <div className="card">Loading…</div>}
      {sprint && (
        <SprintEditor
          title="Edit Sprint"
          initial={sprint}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
