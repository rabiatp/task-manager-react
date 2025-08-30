import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { initialLoginForm } from "../models/auth";
import type { LoginForm, User } from "../models/auth";
import "./login.css";
import Logo from "../logo.png";
import { useNavigate } from "react-router-dom";
import {
  login,
  selectAuthStatus,
  selectAuthError,
} from "../features/auth/authSlice";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [form, setForm] = useState<LoginForm>(initialLoginForm);
  const [user, setUser] = useState<User | null>(null);
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const { setToken } = useAuth();
  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(form))
      .unwrap()
      .then((res) => {
        setToken(res.token);
        navigate("/home", { replace: true });
      })
      .catch((err) => console.error(err));
    console.log(form);
  };

  const handleEmail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  };

  const handlePassWord = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="container">
      {/* Sol taraf - Login */}
      <section className="col left">
        <div className="login">
          <img src={Logo} alt="Logo" className="login-logo" />
          <br className="login-title"></br>
          <div>
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">E-Posta</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={handleEmail}
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
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={handlePassWord}
                  placeholder="••••••"
                  minLength={6}
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Giriş yapılıyor..." : "Giriş Yap"}
              </button>
              {error && <p style={{ color: "crimson" }}>{error}</p>}
              {user && <p className="hint">Welcome, {user.name ?? "user"}!</p>}
            </form>
          </div>
        </div>
      </section>

      {/* Sağ taraf - Signup yönlendirme */}
      <section className="col right">
        <h2 className="welcome">WELCOME</h2>
        <p className="sub-text">Glad to see you again. Let’s get started!</p>
        <div className="signup-block">
          <span>Don’t have an account?</span>
          <button className="glow-btn" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
      </section>
    </div>
  );
}
