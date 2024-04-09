import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analyze" element={<Analyze />} />
    </Routes>
  );
}

export default App;
