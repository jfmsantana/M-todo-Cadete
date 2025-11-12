import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import Simulado from "./pages/Simulado";
import Redacoes from "./pages/Redacoes";
import FazerSimulado from "./pages/FazerSimulado.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #ddd" }}>
                <Link to="/">Home</Link>
                <Link to="/usuarios">Usuários</Link>
                <Link to="/questoes">Questões</Link>
                <Link to="/simulados">Simulados</Link>
                <Link to="/redacoes">Redações</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/questoes" element={<Questoes />} />
                <Route path="/simulados" element={<Simulados />} />
                <Route path="/simulado/:id" element={<Simulado />} />
                <Route path="/redacoes" element={<Redacoes />} />
                <Route path="/simulado/:id/fazer" element={<FazerSimulado />} />
            </Routes>
        </BrowserRouter>
    );
}
