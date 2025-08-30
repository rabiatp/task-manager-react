import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";
import type { JSX } from "react";
import Logo from "../logo.png";

// Basit SVG ikonları (paket kurmadan çalışır)
function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconTasks() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M9 11h10v2H9v-2zm0 6h10v2H9v-2zM7 7 5.5 8.5 4 7l1.5-1.5L7 7zm2-3h10v2H9V4z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M16 14c2.7 0 8 1.35 8 4v2H8v-2c0-2.65 5.3-4 8-4zm0-2a4 4 0 1 0-0.001-8.001A4 4 0 0 0 16 12zM6 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2.5 2c-2.21 0-6.5 1.1-6.5 3.25V20h6"
        fill="currentColor"
      />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M19.14 12.94a7.46 7.46 0 0 0 .05-.94 7.46 7.46 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.35 7.35 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.38 1h-3.76a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.23 8.02a.5.5 0 0 0 .12.64L4.38 10.24c-.03.31-.05.63-.05.96s.02.65.05.96l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.42 1.05.76 1.63.98l.36 2.54a.5.5 0 0 0 .49.42h3.76a.5.5 0 0 0 .49-.42l.36-2.54c.58-.22 1.12-.56 1.63-.98l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
        fill="currentColor"
      />
    </svg>
  );
}

type NavItem = { to: string; label: string; icon: JSX.element; end?: boolean };
const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <IconHome />, end: true },
  { to: "/tasks", label: "Tasks", icon: <IconTasks /> },
  { to: "/registerChild", label: "Add Child", icon: <IconUsers /> },
  { to: "/settings", label: "Ayarlar", icon: <IconSettings /> },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sb-header">
        <div className="logo-mark">
          <img src={Logo} alt="Logo" className="logo-img" />
        </div>
        <div className="logo-text">Sprint Manager</div>
      </div>

      <nav className="sb-nav">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              "sb-link" + (isActive ? " active" : "")
            }
          >
            <span className="sb-ico">{item.icon}</span>
            <span className="sb-label">{item.label}</span>
            <span className="sb-underline" />
          </NavLink>
        ))}
      </nav>

      <div className="sb-footer">
        <button className="sb-logout" onClick={handleLogout}>
          EXIT
        </button>
      </div>
    </aside>
  );
}
