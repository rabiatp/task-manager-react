import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteSprint, listSprints, type Sprint } from "../../services/sprints";

export default function SprintsList() {
  const [items, setItems] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const data = await listSprints();
        setItems(data);
      } catch (e: any) {
        setErr(
          e?.response?.data?.message || e?.message || "Failed to load sprints."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this sprint? Tasks linked to it may be affected."))
      return;
    try {
      await deleteSprint(id);
      setItems((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      alert(
        e?.response?.data?.message || e?.message || "Failed to delete sprint."
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
          Sprints
        </h1>
        <Link to="/sprints/new" className="btn btn-primary">
          New Sprint
        </Link>
      </div>

      {loading && <div className="card">Loading…</div>}
      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>No sprints yet</div>
          <div style={{ color: "#475569", marginBottom: 12 }}>
            Create a sprint to start planning tasks.
          </div>
          <Link to="/sprints/new" className="btn btn-primary">
            Create Sprint
          </Link>
        </div>
      )}

      {!loading && !err && items.length > 0 && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>
                  Start
                </th>
                <th style={{ padding: "10px 8px", textAlign: "left" }}>End</th>
                <th style={{ padding: "10px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid #e6e8f0" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 700 }}>
                    {s.name}
                  </td>
                  <td style={{ padding: "10px 8px" }}>{s.startDate}</td>
                  <td style={{ padding: "10px 8px" }}>{s.endDate}</td>
                  <td
                    style={{
                      padding: "10px 8px",
                      display: "flex",
                      gap: 8,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      className="btn"
                      onClick={() => navigate(`/sprints/${s.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button className="btn" onClick={() => onDelete(s.id)}>
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
