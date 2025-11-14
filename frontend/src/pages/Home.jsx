// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./Home.css";

function getUsuarioLogado() {
    try {
        const raw = localStorage.getItem("usuarioLogado");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const u = getUsuarioLogado();
        if (!u) {
            navigate("/auth");
        } else {
            setUser(u);
        }
    }, [navigate]);

    const nomePerfil = (() => {
        if (!user) return "";
        if (user.perfil === "ALUNO") return "aluno";
        if (user.perfil === "PROFESSOR") return "professor";
        if (user.perfil === "ADMIN") return "admin";
        return user.perfil.toLowerCase();
    })();

    const cards = [
        {
            key: "questoes",
            titulo: "Banco de Questões",
            desc: "Crie, gerencie ou resolva questões por matéria e nível para treinar o conteúdo de forma direcionada.",
            emoji: "📝",
            onClick: () => navigate("/questoes"),
        },
        {
            key: "simulados",
            titulo: "Simulados",
            desc: "Monte simulados completos, entregue tudo de uma vez e acompanhe o desempenho geral.",
            emoji: "🎯",
            onClick: () => navigate("/simulados"),
        },
        {
            key: "redacoes",
            titulo: "Redações",
            desc: "Envie redações (aluno) ou corrija com nota e feedback detalhado (professor/admin).",
            emoji: "✍️",
            onClick: () => navigate("/redacoes"),
        },
        {
            key: "usuarios",
            titulo: "Usuários",
            desc: "Cadastre e gerencie alunos, professores e administradores da plataforma.",
            emoji: "👥",
            onClick: () => navigate("/usuarios"),
        },
    ];

    return (
        <Layout title="Home">
            <div className="home-page">
                {/* HERO / CARD PRINCIPAL – azul com texto branco */}
                <section className="home-hero-card">
                    <div className="home-hero-text">
                        <h1>Bem-vindo ao Método Cadete</h1>
                        {user && (
                            <p>
                                Você está logado como <strong>{nomePerfil}</strong>. Use os
                                cards abaixo para navegar entre questões, simulados e redações.
                            </p>
                        )}
                    </div>
                    <div className="home-hero-badge">
                        <span>📚 Plataforma de estudos</span>
                    </div>
                </section>

                {/* GRID DE CARDS */}
                <section className="home-grid">
                    {cards.map((card, idx) => (
                        <HomeCard
                            key={card.key}
                            data={card}
                            index={idx}
                            variant={card.key}
                        />
                    ))}
                </section>
            </div>
        </Layout>
    );
}

function HomeCard({ data, index, variant }) {
    const { titulo, desc, emoji, onClick } = data;

    return (
        <div
            className={`home-card home-card--${variant}`}
            onClick={onClick}
            style={{ animationDelay: `${0.05 * index}s` }}
        >
            <div className="home-card-icon">{emoji}</div>
            <h3 className="home-card-title">{titulo}</h3>
            <p className="home-card-desc">{desc}</p>
            <div className="home-card-footer">
                <button type="button">Acessar</button>
            </div>
        </div>
    );
}
