import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChild, updateChild, type Child } from "../services/children";

function calcAge(isoDate: string) {
  if (!isoDate) return 0;
  const birth = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function EditChild() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<Child | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        if (!id) throw new Error("Invalid id");
        const data = await getChild(id);
        setChild(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load child."
        );
      }
    })();
  }, [id]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!child || !id) return;

    setError(null);

    // Age/role constraint: 18+ olamaz; doğum tarihi değiştiyse role'ü ayarla
    const age = calcAge(child.birthdate);
    if (age >= 18) {
      setError("People aged 18 or above cannot be under a parent.");
      return;
    }
    const newRole: Child["role"] = age < 13 ? "CHILD" : "TEEN";

    setSaving(true);
    debugger;
    try {
      const updated = await updateChild(id, {
        name: child.name,
        email: child.email,
        birthdate: child.birthdate,
        role: newRole,
      });
      setChild(updated);
      navigate("/children", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to save."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="page-title">Edit Child</h1>
      {!child && !error && <div className="card">Loading…</div>}
      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {child && (
        <form className="form-card" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              className="input"
              type="text"
              value={child.name}
              onChange={(e) =>
                setChild((c) => (c ? { ...c, name: e.target.value } : c))
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="input"
              type="text"
              inputMode="email"
              value={child.email}
              onChange={(e) =>
                setChild((c) => (c ? { ...c, email: e.target.value } : c))
              }
              required
            />
          </div>

          <div className="field">
            <label htmlFor="birthdate">Birth Date</label>
            <input
              id="birthdate"
              className="input"
              type="date"
              value={child.birthdate}
              onChange={(e) =>
                setChild((c) => (c ? { ...c, birthdate: e.target.value } : c))
              }
              required
            />
          </div>

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              Save
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate("/children")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
