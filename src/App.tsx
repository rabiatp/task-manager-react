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
import ChildrenList from "./pages/childrenList";
import EditChild from "./pages/editChild";
import TasksList from "./pages/tasks/taskList";
import NewTask from "./pages/tasks/newTask";
import SprintsList from "./pages/sprints/sprintsList";
import NewSprint from "./pages/sprints/newSprint";
import EditSprint from "./pages/sprints/editSprint";
import EditTask from "./pages/tasks/editTask";

function RequireAuth() {
  const { token, loading } = useAuth();
  if (loading) return null;
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
            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
            <Route path="/home" element={<Home />} />
            <Route path="/registerChild" element={<RegisterChild />} />
            <Route path="/children" element={<ChildrenList />} />
            <Route path="/children/:id/edit" element={<EditChild />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/tasks/new" element={<NewTask />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            <Route path="/sprints" element={<SprintsList />} />
            <Route path="/sprints/new" element={<NewSprint />} />
            <Route path="/sprints/:id/edit" element={<EditSprint />} />
            {/* istersen root'u home'a yönlendir */}
            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
