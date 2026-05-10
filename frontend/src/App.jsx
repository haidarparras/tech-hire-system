import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import UploadPage from "./pages/UploadPage";
import DashboardPage from "./pages/DashboardPage";
import PrediksiPage from "./pages/PrediksiPage";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { colors } = useTheme();

  return (
    <BrowserRouter>
      <div
        style={{
          background: colors.background,
          color: colors.text,
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          transition: "background 0.3s ease, color 0.3s ease",
        }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/prediksi" element={<PrediksiPage />} />
          <Route path="/prediksi/:id" element={<PrediksiPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
