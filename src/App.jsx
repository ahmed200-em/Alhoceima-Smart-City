import { Route, Routes } from "react-router-dom";
import Header from "./layouts/Header.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />} />
    </Routes>
  );
}
