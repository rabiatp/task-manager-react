import { useEffect, useState } from "react";
import { getChildren, deleteChild, type Child } from "../services/children";
import { Link, useNavigate } from "react-router-dom";

export default function ChildrenList() {
  const [items, setItems] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChildren();
      setItems(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load children."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this child? This action cannot be undone.")) return;
    try {
      await deleteChild(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err?.message || "Failed to delete."
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
          marginBottom: 12,
        }}
      >
        <h1 className="page-title" style={{ margin: 0 }}>
          Children
        </h1>
        <Link to="/registerChild" className="btn btn-primary">
          Add Child
        </Link>
      </div>

      {loading && <div className="card">Loading…</div>}
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th style={{ padding: "10px 8px" }}>Name</th>
                <th style={{ padding: "10px 8px" }}>Email</th>
                <th style={{ padding: "10px 8px" }}>Birth Date</th>
                <th style={{ padding: "10px 8px" }}>Role</th>
                <th style={{ padding: "10px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "12px" }}>
                    No children yet.
                  </td>
                </tr>
              )}
              {items.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #e6e8f0" }}>
                  <td style={{ padding: "10px 8px" }}>{c.name}</td>
                  <td style={{ padding: "10px 8px" }}>{c.email}</td>
                  <td style={{ padding: "10px 8px" }}>{c.birthdate}</td>
                  <td style={{ padding: "10px 8px" }}>{c.role}</td>
                  <td style={{ padding: "10px 8px", display: "flex", gap: 8 }}>
                    <button
                      className="btn"
                      onClick={() => navigate(`/children/${c.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button className="btn" onClick={() => onDelete(c.id)}>
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
