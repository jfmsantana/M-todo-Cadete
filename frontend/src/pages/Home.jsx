// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate, useNavigate as useNav, Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNav();

    useEffect(() => {
        const saved = localStorage.getItem("usuarioLogado");
        if (saved) {
            setUser(JSON.parse(saved));
        } else {
            navigate("/auth");
        }
    }, [navigate]);

    if (!user) return null;

    const { email, perfil } = user;

    const cards = [
        {
            title: "Redações",
            desc: "Produzir, corrigir e acompanhar evolução nas redações.",
            to: "/redacoes",
        },
        {
            title: "Questões",
            desc: "Banco de questões por matéria e nível.",
            to: "/questoes",
        },
        {
            title: "Simulados",
            desc: "Montar e resolver simulados completos.",
            to: "/simulados",
        },
        {
            title: "Usuários",
            desc: "Gerenciar alunos, professores e admins.",
            to: "/usuarios",
        },
    ];

    return (
        <div className="home-page">
            <div className="home-content">
                <section className="home-hero">
                    <h1>Método Cadete</h1>
                    <p>
                        Bem-vindo, <strong>{email}</strong> — perfil{" "}
                        <strong>{perfil}</strong>.
                    </p>
                    <p>
                        Organize redações, questões e simulados em um só lugar,
                        acompanhando o desempenho de alunos ao longo do tempo.
                    </p>
                </section>

                <section className="home-grid">
                    {cards.map((card) => (
                        <Link key={card.to} to={card.to} className="home-card">
                            <h2>{card.title}</h2>
                            <p>{card.desc}</p>
                            <span className="home-card-link">Ir para {card.title} →</span>
                        </Link>
                    ))}
                </section>
            </div>
        </div>
    );
}
