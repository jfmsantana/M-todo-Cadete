import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Questoes from "./pages/Questoes";
import Simulado from "./pages/Simulado";
import Redacoes from "./pages/Redacoes";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/questoes">Questões</Link>
        <Link to="/simulado">Simulado</Link>
        <Link to="/redacoes">Redações</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questoes" element={<Questoes />} />
          <Route path="/simulado" element={<Simulado />} />
          <Route path="/redacoes" element={<Redacoes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
