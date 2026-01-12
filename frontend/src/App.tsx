import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground"
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/knowledge-base" element={<Dashboard />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </>
  );
}

export default App;
