import { useEffect, useMemo, useState } from "react";
import type { CreateTaskInput, Priority, Task } from "../../services/tasks";
import { listSprints, type Sprint } from "../../services/sprints";
import { listUsers, type UserRef } from "../../services/users";

type Props = {
  initial?: Partial<Task>;
  onSubmit: (payload: CreateTaskInput) => Promise<void>;
  saving?: boolean;
  title: string;
};

const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export default function TaskEditor({
  initial,
  onSubmit,
  saving,
  title,
}: Props) {
  const [model, setModel] = useState<CreateTaskInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    sprintId: initial?.sprintId ?? "",
    priority: (initial?.priority as Priority) ?? "MEDIUM",
    assigneeIds: initial?.assignees?.map((a) => a.userId) ?? [],
  });
  const [error, setError] = useState<string | null>(null);

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [users, setUsers] = useState<UserRef[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [sp, us] = await Promise.all([listSprints(), listUsers()]);
        setSprints(sp);
        setUsers(us);
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load references."
        );
      }
    })();
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!model.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!model.sprintId) {
      setError("Sprint is required.");
      return;
    }
    try {
      await onSubmit(model);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || e?.message || "Failed to save task."
      );
    }
  };

  const sprintOptions = useMemo(
    () =>
      sprints.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      )),
    [sprints]
  );

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div className="field">
        <label htmlFor="t-title">Title</label>
        <input
          id="t-title"
          className="input"
          type="text"
          value={model.title}
          onChange={(e) => setModel((p) => ({ ...p, title: e.target.value }))}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="t-desc">Description</label>
        <textarea
          id="t-desc"
          className="input"
          rows={4}
          value={model.description}
          onChange={(e) =>
            setModel((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Optional"
        />
      </div>

      <div className="field">
        <label htmlFor="t-sprint">Sprint</label>
        <select
          id="t-sprint"
          className="input"
          value={model.sprintId}
          onChange={(e) =>
            setModel((p) => ({ ...p, sprintId: e.target.value }))
          }
          required
        >
          <option value="">Select a sprint…</option>
          {sprintOptions}
        </select>
      </div>

      <div className="field">
        <label htmlFor="t-priority">Priority</label>
        <select
          id="t-priority"
          className="input"
          value={model.priority ?? "MEDIUM"}
          onChange={(e) =>
            setModel((p) => ({ ...p, priority: e.target.value as Priority }))
          }
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="t-assignees">Assignees</label>
        <select
          id="t-assignees"
          className="input"
          multiple
          value={model.assigneeIds ?? []}
          onChange={(e) => {
            const ids = Array.from(e.target.selectedOptions).map(
              (o) => o.value
            );
            setModel((p) => ({ ...p, assigneeIds: ids }));
          }}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <small style={{ color: "#475569" }}>
          Hold Ctrl/Cmd to select multiple.
        </small>
      </div>

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={!!saving}>
        Save
      </button>
    </form>
  );
}
