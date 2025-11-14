// src/pages/Simulados.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Simulados.css";

function getUsuarioLogado() {
    try {
        const raw = localStorage.getItem("usuarioLogado");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function Simulados() {
    const [user, setUser] = useState(null);

    const [simulados, setSimulados] = useState([]);
    const [loadingSimulados, setLoadingSimulados] = useState(false);
    const [errSimulados, setErrSimulados] = useState(null);

    // criação de simulado com questões
    const [mostrarCriacao, setMostrarCriacao] = useState(false);
    const [tituloSimulado, setTituloSimulado] = useState("");
    const [questoes, setQuestoes] = useState([]);
    const [loadingQuestoes, setLoadingQuestoes] = useState(false);
    const [selecionadasSimulado, setSelecionadasSimulado] = useState({});
    const [loadingCriar, setLoadingCriar] = useState(false);
    const [msgCriacao, setMsgCriacao] = useState(null);
    const [errCriacao, setErrCriacao] = useState(null);

    useEffect(() => {
        const u = getUsuarioLogado();
        if (u) setUser(u);
    }, []);

    const isGestor =
        user && (user.perfil === "ADMIN" || user.perfil === "PROFESSOR");

    async function carregarSimulados() {
        try {
            setLoadingSimulados(true);
            setErrSimulados(null);
            const resp = await fetch("http://localhost:8080/api/simulados");
            if (!resp.ok) {
                const text = await resp.text();
                console.error("Erro ao listar simulados:", resp.status, text);
                throw new Error("Erro ao listar simulados");
            }
            const data = await resp.json();
            setSimulados(data);
        } catch (e) {
            setErrSimulados(e);
        } finally {
            setLoadingSimulados(false);
        }
    }

    async function carregarQuestoes() {
        try {
            setLoadingQuestoes(true);
            setErrCriacao(null);
            const resp = await fetch("http://localhost:8080/api/questoes");
            if (!resp.ok) {
                const text = await resp.text();
                console.error("Erro ao listar questões:", resp.status, text);
                throw new Error("Erro ao listar questões");
            }
            const data = await resp.json();
            setQuestoes(data);
            setSelecionadasSimulado({});
        } catch (e) {
            setErrCriacao(e);
        } finally {
            setLoadingQuestoes(false);
        }
    }

    useEffect(() => {
        carregarSimulados();
    }, []);

    function toggleSelecionadaSimulado(idQuestao) {
        setSelecionadasSimulado((prev) => ({
            ...prev,
            [idQuestao]: !prev[idQuestao],
        }));
    }

    async function criarSimuladoComSelecionadas() {
        const ids = Object.entries(selecionadasSimulado)
            .filter(([, marcado]) => marcado)
            .map(([id]) => Number(id));

        if (!tituloSimulado.trim()) {
            alert("Informe um título para o simulado.");
            return;
        }

        if (ids.length === 0) {
            alert("Selecione pelo menos uma questão.");
            return;
        }

        try {
            setLoadingCriar(true);
            setErrCriacao(null);
            setMsgCriacao(null);

            const resp = await fetch(
                "http://localhost:8080/api/simulados/com-questoes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        titulo: tituloSimulado,
                        questaoIds: ids,
                    }),
                }
            );

            if (!resp.ok) {
                const text = await resp.text();
                console.error("Erro ao criar simulado:", resp.status, text);
                throw new Error("Erro ao criar simulado");
            }

            const simuladoCriado = await resp.json();
            setMsgCriacao(
                `Simulado "${simuladoCriado.titulo}" criado com ${ids.length} questões.`
            );
            setTituloSimulado("");
            setSelecionadasSimulado({});
            await carregarSimulados();
        } catch (e) {
            setErrCriacao(e);
            alert("Erro ao criar simulado.");
        } finally {
            setLoadingCriar(false);
        }
    }

    function contarSelecionadas() {
        return Object.values(selecionadasSimulado).filter(Boolean).length;
    }

    return (
        <Layout title="Simulados">
            <div className="page-shell">
                <div className="page-header-row">
                    <div>
                        <h2 className="page-title">Simulados</h2>
                        <p className="page-subtitle">
                            Crie simulados a partir do Banco de Questões e acompanhe as
                            tentativas.
                        </p>
                    </div>
                </div>

                {/* Área de criação – apenas para gestor */}
                {isGestor && (
                    <div className="card card-elevated" style={{ marginBottom: 16 }}>
                        <div className="card-header-row">
                            <h3 className="card-title">Criar novo simulado</h3>
                            <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => {
                                    const novoMostrar = !mostrarCriacao;
                                    setMostrarCriacao(novoMostrar);
                                    setMsgCriacao(null);
                                    setErrCriacao(null);
                                    if (novoMostrar && questoes.length === 0) {
                                        carregarQuestoes();
                                    }
                                }}
                            >
                                {mostrarCriacao ? "Fechar" : "Selecionar questões"}
                            </button>
                        </div>

                        {mostrarCriacao && (
                            <div style={{ marginTop: 12 }}>
                                <p className="card-subtitle">
                                    Defina o título do simulado e marque as questões que farão
                                    parte dele.
                                </p>

                                <div className="card-row" style={{ marginTop: 8 }}>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Título do simulado (ex.: Simulado ENEM 01)"
                                        value={tituloSimulado}
                                        onChange={(e) => setTituloSimulado(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={criarSimuladoComSelecionadas}
                                        disabled={loadingCriar || loadingQuestoes}
                                    >
                                        {loadingCriar ? "Criando..." : "Criar simulado"}
                                    </button>
                                </div>

                                <p className="muted" style={{ marginTop: 4 }}>
                                    Questões selecionadas:{" "}
                                    <strong>{contarSelecionadas()}</strong>
                                </p>

                                {loadingQuestoes && <p>Carregando questões...</p>}
                                {errCriacao && (
                                    <p style={{ color: "red" }}>
                                        Erro ao carregar/criar simulado.
                                    </p>
                                )}
                                {msgCriacao && (
                                    <p style={{ color: "green", marginTop: 4 }}>{msgCriacao}</p>
                                )}

                                {!loadingQuestoes && questoes.length > 0 && (
                                    <ul
                                        className="lista-gestor"
                                        style={{
                                            maxHeight: 300,
                                            overflowY: "auto",
                                            marginTop: 8,
                                        }}
                                    >
                                        {questoes.map((q) => {
                                            const marcada = !!selecionadasSimulado[q.id];
                                            return (
                                                <li key={q.id}>
                                                    <label
                                                        style={{
                                                            display: "flex",
                                                            gap: 8,
                                                            alignItems: "flex-start",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={marcada}
                                                            onChange={() => toggleSelecionadaSimulado(q.id)}
                                                        />
                                                        <div>
                                                            <div>
                                                                <strong>#{q.id}</strong>{" "}
                                                                <span className="tag-light">
                                  [{q.materia} / {q.nivel}]
                                </span>{" "}
                                                                — {q.enunciado}
                                                            </div>
                                                            {q.statusUso && (
                                                                <div
                                                                    className="muted"
                                                                    style={{ fontSize: 12, marginTop: 2 }}
                                                                >
                                                                    {q.statusUso}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}

                                {!loadingQuestoes && questoes.length === 0 && (
                                    <p className="muted" style={{ marginTop: 8 }}>
                                        Nenhuma questão encontrada no banco.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Lista de simulados */}
                <div className="card card-elevated">
                    <h3 className="card-title">Simulados disponíveis</h3>

                    {errSimulados && (
                        <p style={{ color: "red", marginBottom: 8 }}>
                            Erro ao carregar simulados.
                        </p>
                    )}

                    {loadingSimulados ? (
                        <p>Carregando simulados...</p>
                    ) : simulados.length === 0 ? (
                        <p className="muted">Nenhum simulado cadastrado.</p>
                    ) : (
                        <ul className="lista-simulados">
                            {simulados.map((s) => (
                                <li key={s.id} className="simulado-item">
                                    <div>
                                        <strong>{s.titulo}</strong>
                                        <div className="muted">
                                            {s.questoes ? s.questoes.length : 0} questões.
                                        </div>
                                    </div>
                                    <div className="simulado-actions">
                                        {/* Link simples para a rota de fazer o simulado */}
                                        <a
                                            className="btn-primary"
                                            href={`/simulados/${s.id}`}
                                        >
                                            Fazer simulado
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Layout>
    );
}
