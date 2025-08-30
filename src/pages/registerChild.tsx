import { useState } from "react";
import { initialSignUpForm, type SignUpForm } from "../models/auth";
import { useAppDispatch } from "../app/hook";
import { signup } from "../services/auth";
import { useAuth } from "../context/AuthContext";

function calcAge(isoDate: string) {
  if (!isoDate) return 0;
  const birth = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function RegisterChild() {
  const [form, setForm] = useState<SignUpForm>(initialSignUpForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const registerChild = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    // sadece ebeveyn ekleyebilsin
    if (user?.role !== "PARENT") {
      setError("Only parents can add a child.");
      return;
    }

    const age = calcAge(form.birthdate);
    if (age >= 18) {
      setError(
        "People aged 18 or above cannot be added under a parent. Please create a separate account."
      );
      return;
    }
    if (age <= 0) {
      setError("Please enter a valid date of birth.");
      return;
    }

    const role: SignUpForm["role"] = age < 13 ? "CHILD" : "TEEN";
    const payload: SignUpForm = {
      ...form,
      role,
      parentId: user.id, // <-- KRİTİK NOKTA
    };
    debugger;
    setSubmitting(true);
    try {
      await signup(payload);
      setForm(initialSignUpForm);
    } catch (err) {
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="page-title">ADD CHILD</h1>
      <form className="form-card" onSubmit={registerChild} noValidate>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            className="input"
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">E-Posta</label>
          <input
            id="email"
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="ornek@mail.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input pw-input"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            placeholder="••••••"
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>

        <div className="field">
          <label htmlFor="birthdate">Birth Date</label>
          <input
            id="birthdate"
            className="input"
            type="date"
            value={form.birthdate}
            onChange={(e) =>
              setForm((p) => ({ ...p, birthdate: e.target.value }))
            }
            required
          />
        </div>
        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          Save
        </button>
      </form>
    </div>
  );
}
