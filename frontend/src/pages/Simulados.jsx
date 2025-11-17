// src/pages/Simulados.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Simulados.css";

const API_BASE = "http://localhost:8080/api";
const RESULT_KEY_PREFIX = "simuladosResultados_";
const QUESTOES_API = `${API_BASE}/questoes`;

const MATERIAS = ["PORTUGUES", "MATEMATICA", "INGLES"];
const NIVEIS = ["FIXACAO", "NIVELAMENTO", "CONCURSO"];

function getUsuarioLogado() {
    try {
        const raw = localStorage.getItem("usuarioLogado");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function carregarResultados(userId) {
    if (!userId) return {};
    const key = RESULT_KEY_PREFIX + userId;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export default function Simulados() {
    const [user, setUser] = useState(null);
    const [lista, setLista] = useState([]);
    const [loadingLista, setLoadingLista] = useState(false);
    const [err, setErr] = useState(null);

    const [form, setForm] = useState({ titulo: "", descricao: "" });
    const [resultados, setResultados] = useState({});

    // ---- estados para o banco de questões (para escolher no simulado) ----
    const [questoes, setQuestoes] = useState([]);
    const [loadingQuestoes, setLoadingQuestoes] = useState(false);
    const [materiaFiltro, setMateriaFiltro] = useState("");
    const [nivelFiltro, setNivelFiltro] = useState("");
    const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);

    useEffect(() => {
        const u = getUsuarioLogado();
        if (u) {
            setUser(u);
            setResultados(carregarResultados(u.id));
        }
    }, []);

    useEffect(() => {
        async function carregarLista() {
            try {
                setLoadingLista(true);
                setErr(null);
                const resp = await fetch(`${API_BASE}/simulados`);
                if (!resp.ok) throw new Error("Erro ao listar simulados");
                const data = await resp.json();
                setLista(data);
            } catch (e) {
                setErr(e);
            } finally {
                setLoadingLista(false);
            }
        }

        carregarLista();
    }, []);

    const isGestor =
        user && (user.perfil === "ADMIN" || user.perfil === "PROFESSOR");

    // ---- carregar questões do banco para o seletor ----
    useEffect(() => {
        if (!isGestor) return; // só gestor precisa carregar questões

        async function carregarQuestoes() {
            try {
                setLoadingQuestoes(true);
                setErr(null);

                const params = [];
                if (materiaFiltro) params.push(`materia=${materiaFiltro}`);
                if (nivelFiltro) params.push(`nivel=${nivelFiltro}`);

                const qs = params.length ? `?${params.join("&")}` : "";
                const resp = await fetch(`${QUESTOES_API}${qs}`);

                if (!resp.ok) {
                    throw new Error("Erro ao carregar questões");
                }

                const data = await resp.json();
                setQuestoes(data || []);
            } catch (e) {
                setErr(e);
            } finally {
                setLoadingQuestoes(false);
            }
        }

        carregarQuestoes();
    }, [isGestor, materiaFiltro, nivelFiltro]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function toggleQuestaoSelecionada(id) {
        setQuestoesSelecionadas((prev) =>
            prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
        );
    }

    async function handleCriar(e) {
        e.preventDefault();
        if (!isGestor) {
            alert("Apenas professores e admins podem criar simulados.");
            return;
        }
        if (!form.titulo.trim()) {
            alert("Informe um título.");
            return;
        }

        try {
            setErr(null);

            const payload = {
                titulo: form.titulo,
                descricao: form.descricao,
                questaoIds: questoesSelecionadas,
            };

            const resp = await fetch(`${API_BASE}/simulados`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id, // se o backend usar, já está aqui
                },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) throw new Error("Erro ao criar simulado");

            setForm({ titulo: "", descricao: "" });
            setQuestoesSelecionadas([]);

            // recarrega lista
            const novaLista = await (await fetch(`${API_BASE}/simulados`)).json();
            setLista(novaLista);
        } catch (e) {
            setErr(e);
        }
    }

    async function handleDeletar(id) {
        if (!isGestor) {
            alert("Apenas professores e admins podem excluir simulados.");
            return;
        }
        if (!window.confirm("Tem certeza que deseja excluir este simulado?")) return;

        try {
            const resp = await fetch(`${API_BASE}/simulados/${id}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": user.id,
                },
            });
            if (!resp.ok) throw new Error("Erro ao excluir simulado");
            setLista((prev) => prev.filter((s) => s.id !== id));
        } catch (e) {
            setErr(e);
        }
    }

    function renderStatusSimulado(s) {
        const r = resultados[s.id];
        if (!r) return <span className="muted">Ainda não feito</span>;

        const perc = r.total > 0 ? ((r.acertos / r.total) * 100).toFixed(1) : "0.0";
        return (
            <span className="simulado-status-feito">
        Feito — {r.acertos}/{r.total} ({perc}%)
      </span>
        );
    }

    function renderBotaoAcao(s) {
        const r = resultados[s.id];

        if (r && !isGestor) {
            const perc = r.total > 0 ? ((r.acertos / r.total) * 100).toFixed(1) : "0.0";
            return (
                <button
                    type="button"
                    className="btn-ghost"
                    disabled
                    title="Simulado já realizado"
                >
                    Feito — {r.acertos}/{r.total} ({perc}%)
                </button>
            );
        }

        return (
            <a className="btn-primary" href={`/simulados/${s.id}`}>
                {isGestor ? "Visualizar" : "Fazer simulado"}
            </a>
        );
    }

    return (
        <Layout title="Simulados">
            <div className="page-shell">
                <section className="page-hero page-hero--simulados">
                    <div className="page-hero-main">
                        <h2 className="page-title">Simulados</h2>
                        <p className="page-subtitle">
                            Veja todos os simulados disponíveis e acompanhe os que você já fez.
                        </p>
                    </div>
                </section>

                <div className={isGestor ? "grid grid-2" : ""}>
                    {/* Lista de simulados */}
                    <div className="card card-elevated">
                        <h3 className="card-title">Simulados cadastrados</h3>

                        {err && (
                            <p style={{ color: "crimson", marginTop: 4 }}>
                                {err.message || "Erro ao carregar / salvar dados."}
                            </p>
                        )}

                        {loadingLista ? (
                            <p>Carregando simulados...</p>
                        ) : lista.length === 0 ? (
                            <p className="muted">Nenhum simulado cadastrado.</p>
                        ) : (
                            <div className="simulados-list">
                                {lista.map((s) => (
                                    <div key={s.id} className="simulado-card">
                                        <div className="simulado-card-main">
                                            <h3>{s.titulo || `Simulado #${s.id}`}</h3>
                                            <p>{s.descricao || "Simulado para treino."}</p>
                                            <p className="simulado-meta">ID: {s.id}</p>
                                            <div className="simulado-status-row">
                                                {renderStatusSimulado(s)}
                                            </div>
                                        </div>
                                        <div className="simulado-card-actions">
                                            {renderBotaoAcao(s)}
                                            {isGestor && (
                                                <button
                                                    type="button"
                                                    className="simulado-delete"
                                                    onClick={() => handleDeletar(s.id)}
                                                >
                                                    Excluir
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Criar novo simulado – SOMENTE para gestor */}
                    {isGestor && (
                        <div className="card card-elevated">
                            <h3 className="card-title">Criar novo simulado</h3>
                            <form className="simulados-form" onSubmit={handleCriar}>
                                <div className="form-group">
                                    <label htmlFor="titulo">Título</label>
                                    <input
                                        id="titulo"
                                        name="titulo"
                                        type="text"
                                        className="input"
                                        placeholder="Ex.: Simulado ENEM"
                                        value={form.titulo}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descricao">Descrição</label>
                                    <textarea
                                        id="descricao"
                                        name="descricao"
                                        className="input"
                                        rows={3}
                                        placeholder="Breve descrição do simulado."
                                        value={form.descricao}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Seletor de questões */}
                                <div className="form-group">
                                    <label>Questões do banco</label>
                                    <p className="muted" style={{ marginBottom: 8 }}>
                                        Filtre e marque as questões que farão parte deste simulado.
                                    </p>

                                    <div
                                        className="card"
                                        style={{ padding: 8, marginBottom: 8, gap: 8 }}
                                    >
                                        <div className="card-row">
                                            <select
                                                className="input"
                                                value={materiaFiltro}
                                                onChange={(e) => setMateriaFiltro(e.target.value)}
                                            >
                                                <option value="">Todas as matérias</option>
                                                {MATERIAS.map((m) => (
                                                    <option key={m} value={m}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="input"
                                                value={nivelFiltro}
                                                onChange={(e) => setNivelFiltro(e.target.value)}
                                            >
                                                <option value="">Todos os níveis</option>
                                                {NIVEIS.map((n) => (
                                                    <option key={n} value={n}>
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {loadingQuestoes ? (
                                            <p className="muted">Carregando questões...</p>
                                        ) : questoes.length === 0 ? (
                                            <p className="muted">
                                                Nenhuma questão encontrada para esse filtro.
                                            </p>
                                        ) : (
                                            <div
                                                style={{
                                                    maxHeight: 220,
                                                    overflowY: "auto",
                                                    borderTop: "1px solid #eee",
                                                    marginTop: 8,
                                                    paddingTop: 8,
                                                }}
                                            >
                                                {questoes.map((q) => (
                                                    <label
                                                        key={q.id}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "flex-start",
                                                            gap: 8,
                                                            marginBottom: 6,
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={questoesSelecionadas.includes(q.id)}
                                                            onChange={() => toggleQuestaoSelecionada(q.id)}
                                                            style={{ marginTop: 4 }}
                                                        />
                                                        <div>
                                                            <div style={{ fontSize: 12, opacity: 0.7 }}>
                                                                #{q.id} • {q.materia} • {q.nivel}
                                                            </div>
                                                            <div style={{ fontSize: 13 }}>{q.enunciado}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {questoesSelecionadas.length > 0 && (
                                        <p className="muted">
                                            Questões selecionadas:{" "}
                                            <strong>{questoesSelecionadas.length}</strong>
                                        </p>
                                    )}
                                </div>

                                <button type="submit" className="btn-primary">
                                    Salvar
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
