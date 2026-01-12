import { Route, Routes, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/knowledge-base" replace />} />
        <Route path="/knowledge-base" element={<Dashboard />} />
      </Routes>
    </>
  );
}

  export default App;
