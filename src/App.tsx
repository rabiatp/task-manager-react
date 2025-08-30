import {
  Routes,
  Route,
  BrowserRouter,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import AuthedLayout from "./layouts/AuthedLayout";
import "./index.css";
import { useAuth } from "./context/AuthContext";
import RegisterChild from "./pages/registerChild";

function RequireAuth() {
  const { token, loading } = useAuth();
  if (loading) return null; // spinner koyabilirsin
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* protected */}
        <Route element={<RequireAuth />}>
          <Route element={<AuthedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/registerChild" element={<RegisterChild />} />
            {/* istersen root'u home'a yönlendir */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
