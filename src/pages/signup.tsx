import { useState } from "react";
import { initialSignUpForm, type SignUpForm } from "../models/auth";
import Logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hook";
import { signup } from "../features/auth/authSlice";

function calcAge(isoDate: string) {
  if (!isoDate) return 0;
  const birth = new Date(isoDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function SignUp() {
  const [form, setForm] = useState<SignUpForm>(initialSignUpForm);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAdult = form.birthdate ? calcAge(form.birthdate) >= 18 : false;
  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.password.length >= 6 &&
    form.birthdate &&
    isAdult;

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAdult) {
      setError("18 yaşından küçükler kayıt olamaz.");
      return;
    }
    setError(null);
    dispatch(signup(form))
      .unwrap()
      .then(() => navigate("/login"))
      .catch((err) => setError(err));
  };

  return (
    <div className="login">
      <div>
        <img src={Logo} alt="Logo" className="login-logo" />
      </div>

      <form className="login-form" onSubmit={registerUser} noValidate>
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
        {error && <div className="error">{error}</div>}

        <button className="btn-primary" type="submit" disabled={!canSubmit}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
