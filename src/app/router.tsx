// Rotas (React Router)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import SpacesPage from "../pages/spaces";
import SpaceDetailPage from "../pages/space-detail/[spaceId]";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/spaces" element={<SpacesPage />} />
        <Route path="/spaces/:spaceId" element={<SpaceDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
