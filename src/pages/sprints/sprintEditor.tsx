import { useState } from "react";
import type { CreateSprintInput, Sprint } from "../../services/sprints";

type Props = {
  initial?: Partial<Sprint>;
  onSubmit: (payload: CreateSprintInput) => Promise<void>;
  title: string;
};

export default function SprintEditor({ initial, onSubmit, title }: Props) {
  const [m, setM] = useState<CreateSprintInput>({
    name: initial?.name ?? "",
    startDate: initial?.startDate ?? "",
    endDate: initial?.endDate ?? "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    if (!m.name.trim()) return setErr("Name is required.");
    if (!m.startDate || !m.endDate)
      return setErr("Start and end dates are required.");
    if (new Date(m.startDate) > new Date(m.endDate))
      return setErr("Start date cannot be after end date.");

    try {
      setSaving(true);
      await onSubmit(m);
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || e?.message || "Failed to save sprint."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div className="field">
        <label htmlFor="sp-name">Name</label>
        <input
          id="sp-name"
          className="input"
          value={m.name}
          onChange={(e) => setM((p) => ({ ...p, name: e.target.value }))}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="sp-start">Start Date</label>
        <input
          id="sp-start"
          className="input"
          type="date"
          value={m.startDate}
          onChange={(e) => setM((p) => ({ ...p, startDate: e.target.value }))}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="sp-end">End Date</label>
        <input
          id="sp-end"
          className="input"
          type="date"
          value={m.endDate}
          onChange={(e) => setM((p) => ({ ...p, endDate: e.target.value }))}
          required
        />
      </div>

      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}

      <button className="btn btn-primary" disabled={saving}>
        Save
      </button>
    </form>
  );
}
