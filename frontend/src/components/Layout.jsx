// src/components/Layout.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Layout({ children }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("usuarioLogado");
        if (saved) {
            setUser(JSON.parse(saved));
        } else {
            navigate("/auth");
        }
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem("usuarioLogado");
        setUser(null);
        navigate("/auth");
    }

    if (!user) return null;

    const perfil = user.perfil; // "ADMIN" | "PROFESSOR" | "ALUNO"

    return (
        <div>
            <header
                style={{
                    padding: "8px 16px",
                    background: "#ffffff",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            Usuário atual: <strong>{user.email}</strong> — {perfil}
          </span>
                    <button onClick={handleLogout}>Sair</button>
                </div>

                <nav style={{ display: "flex", gap: 16 }}>
                    <Link to="/home">Home</Link>
                    <Link to="/usuarios">Usuários</Link>
                    <Link to="/questoes">Questões</Link>
                    <Link to="/simulados">Simulados</Link>
                    <Link to="/redacoes">Redações</Link>
                </nav>
            </header>

            <main style={{ minHeight: "calc(100vh - 80px)", background: "#f3f4f6" }}>
                {children}
            </main>
        </div>
    );
}
