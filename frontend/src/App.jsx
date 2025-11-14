// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import Redacoes from "./pages/Redacoes";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Login */}
                <Route path="/" element={<AuthPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Páginas internas (já com Layout dentro de cada componente) */}
                <Route path="/home" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/questoes" element={<Questoes />} />
                <Route path="/simulados" element={<Simulados />} />
                <Route path="/redacoes" element={<Redacoes />} />

                {/* Qualquer rota desconhecida manda pro login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
