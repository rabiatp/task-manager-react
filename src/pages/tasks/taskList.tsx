import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteTask,
  listTasks,
  toggleStatus,
  type Task,
} from "../../services/tasks";

function StatusBadge({ s }: { s: Task["status"] }) {
  const map = {
    TODO: "badge badge-open",
    IN_PROGRESS: "badge badge-progress",
    DONE: "badge badge-done",
  } as const;
  return <span className={map[s]}>{s.replace("_", " ")}</span>;
}

export default function TasksList() {
  const [items, setItems] = useState<Task[]>([]);
  const [q, setQ] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await listTasks();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        const status = e?.response?.status;
        // Bazı backendler boşken 404/204 döndürebiliyor → boş liste kabul et
        if (status === 404 || status === 204) {
          setItems([]);
          setErr(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const text = q.toLowerCase();
    return items.filter((t) => {
      const okText =
        !text ||
        t.title.toLowerCase().includes(text) ||
        (t.description || "").toLowerCase().includes(text);
      const okDone = !hideDone || t.status !== "DONE";
      return okText && okDone;
    });
  }, [items, q, hideDone]);

  const onToggle = async (t: Task) => {
    try {
      const updated = await toggleStatus(t.id, t.status);
      setItems((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (e: any) {
      alert(
        e?.response?.data?.message || e?.message || "Failed to update status."
      );
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this task? This action cannot be undone.")) return;
    try {
      await deleteTask(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(
        e?.response?.data?.message || e?.message || "Failed to delete task."
      );
    }
  };

  return (
    <div className="app-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>
          Tasks
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(e) => setHideDone(e.target.checked)}
            />
            Hide done
          </label>
          <Link to="/tasks/new" className="btn btn-primary">
            New Task
          </Link>
        </div>
      </div>

      {loading && <div className="card">Loading…</div>}
      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}

      {!loading && !err && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>
                  Title
                </th>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>
                  Sprint
                </th>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>
                  Priority
                </th>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>
                  Status
                </th>
                <th style={{ padding: "10px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "12px" }}>
                    No tasks.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid #e6e8f0" }}>
                  <td style={{ padding: "10px 8px" }}>
                    <div style={{ fontWeight: 700 }}>{t.title}</div>
                    {t.description && (
                      <div style={{ fontSize: 13, color: "#475569" }}>
                        {t.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    {t.sprint?.name ?? t.sprintId}
                  </td>
                  <td style={{ padding: "10px 8px" }}>{t.priority}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <StatusBadge s={t.status} />
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button className="btn" onClick={() => onToggle(t)}>
                      Toggle
                    </button>
                    <button
                      className="btn"
                      onClick={() => navigate(`/tasks/${t.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button className="btn" onClick={() => onDelete(t.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
