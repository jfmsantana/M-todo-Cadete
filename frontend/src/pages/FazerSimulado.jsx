// src/pages/FazerSimulado.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import Layout from "../components/Layout";

const ALTERNATIVAS = ["A", "B", "C", "D"];
const API_BASE = "http://localhost:8080/api";

const RESULT_KEY_PREFIX = "simuladosResultados_";

function getUsuarioLogado() {
    try {
        const raw = localStorage.getItem("usuarioLogado");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function salvarResultadoLocal(userId, simuladoId, acertos, total) {
    if (!userId) return;
    const key = RESULT_KEY_PREFIX + userId;
    let data = {};
    try {
        const raw = localStorage.getItem(key);
        if (raw) data = JSON.parse(raw);
    } catch {
        data = {};
    }
    data[simuladoId] = { acertos, total };
    localStorage.setItem(key, JSON.stringify(data));
}

export default function FazerSimulado() {
    const { id } = useParams(); // ID do simulado
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [simulado, setSimulado] = useState(null);
    const [tentativaId, setTentativaId] = useState(null);
    const [respostas, setRespostas] = useState({});
    const [resultado, setResultado] = useState(null);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const u = getUsuarioLogado();
        setUser(u || null);
    }, []);

    // Carregar simulado
    useEffect(() => {
        async function carregar() {
            try {
                setLoading(true);
                setErr(null);
                const resp = await fetch(`${API_BASE}/simulados/${id}`);
                if (!resp.ok) {
                    const text = await resp.text();
                    console.error("Erro ao buscar simulado:", resp.status, text);
                    throw new Error("Erro ao buscar simulado");
                }
                const data = await resp.json();
                setSimulado(data);
            } catch (e) {
                console.error(e);
                setErr(e);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    async function iniciarSimulado() {
        if (!user) {
            alert("Faça login para iniciar o simulado.");
            return;
        }

        try {
            setLoading(true);
            setErr(null);
            setResultado(null);
            setRespostas({});
            setTentativaId(null);

            const resp = await fetch(
                `${API_BASE}/simulados/${simulado.id}/iniciar`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ alunoId: user.id }),
                }
            );

            if (!resp.ok) {
                const text = await resp.text();
                console.error("Erro ao iniciar tentativa:", resp.status, text);
                throw new Error("Erro ao iniciar tentativa");
            }

            const data = await resp.json(); // { tentativaId }
            setTentativaId(data.tentativaId);
        } catch (e) {
            console.error(e);
            setErr(e);
        } finally {
            setLoading(false);
        }
    }

    function marcarResposta(questaoId, letra) {
        if (resultado) return; // depois de entregar, não mexe
        setRespostas((prev) => ({ ...prev, [questaoId]: letra }));
    }

    async function entregarSimulado(e) {
        e.preventDefault();

        if (!tentativaId) {
            alert("Primeiro clique em 'Iniciar simulado'.");
            return;
        }

        if (!simulado || !simulado.questoes || simulado.questoes.length === 0) {
            alert("Simulado sem questões.");
            return;
        }

        const itens = simulado.questoes.map((q) => ({
            questaoId: q.id,
            marcada: respostas[q.id] || " ",
        }));

        try {
            setLoading(true);
            setErr(null);

            // 1) envia respostas
            const resp1 = await fetch(
                `${API_BASE}/tentativas/${tentativaId}/responder`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itens }),
                }
            );
            if (!resp1.ok) {
                const text = await resp1.text();
                console.error("Erro ao enviar respostas:", resp1.status, text);
                throw new Error("Erro ao enviar respostas");
            }

            // 2) entrega e pega o resultado
            const resp2 = await fetch(
                `${API_BASE}/tentativas/${tentativaId}/entregar`,
                { method: "POST" }
            );
            if (!resp2.ok) {
                const text = await resp2.text();
                console.error("Erro ao entregar simulado:", resp2.status, text);
                throw new Error("Erro ao entregar simulado");
            }

            const res = await resp2.json(); // TentativaDTOs.Resultado
            setResultado(res);

            // salva no localStorage para aparecer na lista de simulados
            salvarResultadoLocal(
                user?.id,
                simulado.id,
                res.acertos,
                res.total
            );
        } catch (e) {
            console.error(e);
            setErr(e);
        } finally {
            setLoading(false);
        }
    }

    // estados de carregamento/erro antes de ter simulado
    if (loading && !simulado) {
        return (
            <Layout title="Fazer simulado">
                <div className="page-shell">
                    <div className="card card-elevated">
                        <Loader />
                    </div>
                </div>
            </Layout>
        );
    }

    if (err && !simulado) {
        return (
            <Layout title="Fazer simulado">
                <div className="page-shell">
                    <div className="card card-elevated">
                        <ErrorMsg error={err} />
                    </div>
                </div>
            </Layout>
        );
    }

    if (!simulado) {
        return (
            <Layout title="Fazer simulado">
                <div className="page-shell">
                    <div className="card card-elevated">
                        <p>Simulado não encontrado.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const totalQuestoes = simulado.questoes?.length || 0;

    // Layout principal
    return (
        <Layout title={`Simulado: ${simulado.titulo || ""}`}>
            <div className="page-shell">
                <div className="page-header-row">
                    <div>
                        <h2 className="page-title">{simulado.titulo}</h2>
                        <p className="page-subtitle">
                            Responda todas as questões e clique em <strong>Entregar simulado</strong> para ver seu desempenho.
                        </p>
                    </div>
                </div>

                <div className="card card-elevated">
                    {/* Resultado depois de entregue */}
                    {resultado && (
                        <div
                            className="card card-elevated"
                            style={{ marginBottom: 16, background: "#f6fff6" }}
                        >
                            <h3>Resultado do simulado</h3>
                            <p>
                                Você acertou{" "}
                                <strong>
                                    {resultado.acertos} / {resultado.total}
                                </strong>{" "}
                                (
                                {resultado.total
                                    ? ((resultado.acertos / resultado.total) * 100).toFixed(1)
                                    : 0}
                                %)
                            </p>

                            <div
                                style={{
                                    marginTop: 12,
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => navigate("/home")}
                                >
                                    Voltar para a Home
                                </button>
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    onClick={() => navigate("/simulados")}
                                >
                                    Ver lista de simulados
                                </button>
                            </div>
                        </div>
                    )}

                    {err && (
                        <div style={{ marginBottom: 8 }}>
                            <ErrorMsg error={err} />
                        </div>
                    )}

                    {/* Antes de iniciar */}
                    {!tentativaId && !resultado && (
                        <div>
                            <p>
                                Este simulado possui{" "}
                                <strong>{simulado.questoes?.length || 0}</strong> questão(ões).
                            </p>
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={iniciarSimulado}
                                disabled={loading}
                            >
                                {loading ? "Iniciando..." : "Iniciar simulado"}
                            </button>
                        </div>
                    )}

                    {/* Após iniciar: formulário de respostas */}
                    {tentativaId && (
                        <form
                            onSubmit={entregarSimulado}
                            className="simulado-form"
                            style={{ marginTop: 16 }}
                        >
                            <ol>
                                {simulado.questoes.map((q) => (
                                    <li key={q.id} style={{ marginBottom: 16 }}>
                                        <p className="simulado-questao-enunciado">
                                            <strong>
                                                #{q.id}) {q.enunciado}
                                            </strong>
                                        </p>

                                        {ALTERNATIVAS.map((letra) => {
                                            const texto = q[`alternativa${letra}`];
                                            if (!texto) return null;

                                            const marcada = respostas[q.id];

                                            return (
                                                <label
                                                    key={letra}
                                                    className="alternativa-item"
                                                    style={{ display: "block", marginBottom: 4 }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`q-${q.id}`}
                                                        value={letra}
                                                        checked={marcada === letra}
                                                        onChange={() => marcarResposta(q.id, letra)}
                                                        disabled={!!resultado}
                                                    />{" "}
                                                    <span className="alternativa-letra">{letra})</span>{" "}
                                                    <span className="alternativa-texto">{texto}</span>
                                                </label>
                                            );
                                        })}
                                    </li>
                                ))}
                            </ol>

                            <div className="card-actions-right" style={{ marginTop: 12 }}>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={!!resultado || loading}
                                >
                                    {resultado ? "Simulado já entregue" : "Entregar simulado"}
                                </button>
                            </div>

                            <p
                                style={{
                                    marginTop: 8,
                                    fontSize: 12,
                                    color: "#666",
                                }}
                            >
                                Questões respondidas:{" "}
                                {
                                    Object.values(respostas).filter(
                                        (v) => v && v.trim().length > 0
                                    ).length
                                }{" "}
                                / {totalQuestoes}
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </Layout>
    );
}
