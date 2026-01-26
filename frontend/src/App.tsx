import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import KnowledgeBase from "./pages/KnowledgeBase";
import Playground from "./pages/Playground";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/knowledge-base" replace />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
