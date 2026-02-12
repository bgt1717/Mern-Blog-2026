import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPost from "./pages/EditPost";
import Blog from "./pages/Blog";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog" element={<Blog />} />



        {/* 🔐 Protected */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
