import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./pages/KnowledgeBase";
import Playground from "./pages/Playground";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/knowledge-base" element={<Dashboard />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default App;
