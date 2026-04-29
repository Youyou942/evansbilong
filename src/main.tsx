import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import { ProjectPage } from "./app/pages/ProjectPage.tsx";
import { ContactPage } from "./app/pages/ContactPage.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      {/* Page d'accueil — portfolio complet */}
      <Route path="/" element={<App />} />

      {/* Pages projet individuelles — /projects/:slug */}
      <Route path="/projects/:slug" element={<ProjectPage />} />

      {/* Page contact dédiée — /contact */}
      <Route path="/contact" element={<ContactPage />} />

      {/* Fallback — redirige vers l'accueil */}
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);
