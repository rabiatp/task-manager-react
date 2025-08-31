import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar.css";
import type { JSX } from "react";
import Logo from "../logo.png";
import { HiUsers } from "react-icons/hi2";
import { FaUserPlus } from "react-icons/fa6";
import { HiMiniCalendarDays } from "react-icons/hi2";

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
  return <FaUserPlus />;
}

function IconView() {
  return <HiUsers />;
}
function IconSprints() {
  return <HiMiniCalendarDays />;
}

type NavItem = { to: string; label: string; icon: JSX.Element; end?: boolean };
const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: <IconHome />, end: true },
  { to: "/tasks", label: "Tasks", icon: <IconTasks /> },
  { to: "/sprints", label: "Sprints", icon: <IconSprints /> },
  { to: "/registerChild", label: "Add Child", icon: <IconUsers /> },
  { to: "/children", label: "Children", icon: <IconView /> },
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
