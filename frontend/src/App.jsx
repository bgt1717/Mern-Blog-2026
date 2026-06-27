import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import './styles/style.css';



//Main routing file — controls how pages load in the MERN blog app.
function App() {
  return (
    <>
    {/* Navbar renders above routes. Above all componenets.  */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<Post />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
