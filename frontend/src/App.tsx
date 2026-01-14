import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./pages/KnowledgeBase";
import Playground from "./pages/Playground";
import Analytics from "./pages/Analytics";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/knowledge-base" element={<Dashboard />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default App;
