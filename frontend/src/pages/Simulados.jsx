// src/pages/Simulados.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Simulados.css";

const ALTERNATIVAS = [
    { letra: "A", campo: "alternativaA" },
    { letra: "B", campo: "alternativaB" },
    { letra: "C", campo: "alternativaC" },
    { letra: "D", campo: "alternativaD" },
];

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
    const [lista, setLista] = useState([]);
    const [loadingLista, setLoadingLista] = useState(false);
    const [err, setErr] = useState(null);

    const [form, setForm] = useState({ titulo: "", descricao: "" });

    // resolução
    const [simuladoAtivo, setSimuladoAtivo] = useState(null);
    const [tentativaId, setTentativaId] = useState(null);
    const [respostas, setRespostas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [entregue, setEntregue] = useState(false);
    const [loadingSimulado, setLoadingSimulado] = useState(false);

    useEffect(() => {
        const u = getUsuarioLogado();
        if (u) setUser(u);
    }, []);

    const isGestor =
        user && (user.perfil === "ADMIN" || user.perfil === "PROFESSOR");

    async function carregarLista() {
        try {
            setLoadingLista(true);
            setErr(null);
            const resp = await fetch("http://localhost:8080/api/simulados");
            if (!resp.ok) throw new Error("Erro ao listar simulados");
            const data = await resp.json();
            setLista(data);
        } catch (e) {
            setErr(e);
        } finally {
            setLoadingLista(false);
        }
    }

    useEffect(() => {
        carregarLista();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
            const resp = await fetch("http://localhost:8080/api/simulados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": user.id,
                },
                body: JSON.stringify(form),
            });
            if (!resp.ok) throw new Error("Erro ao criar simulado");
            setForm({ titulo: "", descricao: "" });
            await carregarLista();
        } catch (e) {
            setErr(e);
        }
    }

    async function handleDeletar(id) {
        if (!isGestor) {
            alert("Apenas professores e admins podem excluir simulados.");
            return;
        }
        if (!window.confirm("Tem certeza que deseja excluir este simulado?"))
            return;

        try {
            const resp = await fetch(`http://localhost:8080/api/simulados/${id}`, {
                method: "DELETE",
                headers: {
                    "x-user-id": user.id,
                },
            });
            if (!resp.ok) throw new Error("Erro ao excluir simulado");
            setLista((prev) => prev.filter((s) => s.id !== id));
            if (simuladoAtivo && simuladoAtivo.id === id) {
                limparSimuladoAtivo();
            }
        } catch (e) {
            setErr(e);
        }
    }

    function limparSimuladoAtivo() {
        setSimuladoAtivo(null);
        setTentativaId(null);
        setRespostas({});
        setResultado(null);
        setEntregue(false);
    }

    async function abrirSimuladoComoAluno(id) {
        if (!user) {
            alert("Faça login primeiro.");
            return;
        }
        try {
            setLoadingSimulado(true);
            setErr(null);
            setResultado(null);
            setEntregue(false);
            setRespostas({});

            // inicia a tentativa
            const respInit = await fetch(
                `http://localhost:8080/api/simulados/${id}/iniciar`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ alunoId: user.id }),
                }
            );
            if (!respInit.ok) {
                const text = await respInit.text();
                console.error("Erro ao iniciar tentativa:", respInit.status, text);
                throw new Error("Erro ao iniciar tentativa");
            }
            const tentativa = await respInit.json();
            setTentativaId(tentativa.id);

            // carrega detalhes do simulado com questões
            const respSim = await fetch(
                `http://localhost:8080/api/simulados/${id}`
            );
            if (!respSim.ok) throw new Error("Erro ao carregar simulado");
            const sim = await respSim.json();
            setSimuladoAtivo(sim);
        } catch (e) {
            setErr(e);
        } finally {
            setLoadingSimulado(false);
        }
    }

    function selecionarAlternativa(questaoId, letra) {
        if (entregue) return;
        setRespostas((prev) => ({ ...prev, [questaoId]: letra }));
    }

    async function entregarSimulado() {
        if (!simuladoAtivo || !tentativaId) {
            alert("Erro: simulado ou tentativa não encontrados.");
            return;
        }
        if (!simuladoAtivo.questoes || simuladoAtivo.questoes.length === 0) {
            alert("Simulado sem questões.");
            return;
        }

        const semResposta = simuladoAtivo.questoes.filter(
            (q) => !respostas[q.id]
        );
        if (semResposta.length > 0) {
            const ok = window.confirm(
                "Há questões sem resposta. Deseja entregar mesmo assim?"
            );
            if (!ok) return;
        }

        try {
            // envia respostas marcadas
            const itens = Object.entries(respostas).map(([questaoId, marcada]) => ({
                questaoId: Number(questaoId),
                marcada,
            }));

            const respResp = await fetch(
                `http://localhost:8080/api/tentativas/${tentativaId}/responder`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ itens }),
                }
            );
            if (!respResp.ok) {
                console.error(
                    "Erro ao salvar respostas:",
                    respResp.status,
                    await respResp.text()
                );
            }

            // entrega
            const respEnt = await fetch(
                `http://localhost:8080/api/tentativas/${tentativaId}/entregar`,
                { method: "POST" }
            );
            if (!respEnt.ok) {
                console.error(
                    "Erro ao entregar tentativa:",
                    respEnt.status,
                    await respEnt.text()
                );
                alert("Erro ao entregar simulado.");
                return;
            }

            const data = await respEnt.json();
            setResultado(data);
            setEntregue(true);

            if (data.gabarito) {
                const map = {};
                data.gabarito.forEach((g) => {
                    map[g.questaoId] = g.marcada;
                });
                setRespostas(map);
            }
        } catch (e) {
            console.error(e);
            alert("Erro ao entregar simulado.");
        }
    }

    return (
        <Layout title="Simulados">
            <div className="simulados-admin-container">
                <div className="simulados-admin-left">
                    <h2>Simulados cadastrados</h2>

                    {err && (
                        <p style={{ color: "crimson", marginTop: 4 }}>
                            {err.message || "Erro ao carregar / salvar dados."}
                        </p>
                    )}

                    {loadingLista ? (
                        <p>Carregando simulados...</p>
                    ) : lista.length === 0 ? (
                        <p>Nenhum simulado cadastrado.</p>
                    ) : (
                        <div className="simulados-list">
                            {lista.map((s) => (
                                <div key={s.id} className="simulado-card">
                                    <div className="simulado-card-main">
                                        <h3>{s.titulo || `Simulado #${s.id}`}</h3>
                                        <p>{s.descricao || "Simulado para treino."}</p>
                                        <p className="simulado-meta">ID: {s.id}</p>
                                    </div>
                                    <div className="simulado-card-actions">
                                        <button
                                            type="button"
                                            onClick={() => abrirSimuladoComoAluno(s.id)}
                                        >
                                            Fazer como aluno
                                        </button>
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

                <div className="simulados-admin-right">
                    <div className="simulados-form-card">
                        <h2>Criar novo simulado</h2>
                        {isGestor ? (
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
                                <button type="submit" className="btn-primary">
                                    Salvar
                                </button>
                            </form>
                        ) : (
                            <p className="simulados-info-msg">
                                Apenas professores e admins podem criar simulados.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {simuladoAtivo && (
                <div className="simulado-ativo">
                    <div className="simulado-ativo-header">
                        <div>
                            <h2>{simuladoAtivo.titulo || `Simulado #${simuladoAtivo.id}`}</h2>
                            <p className="simulado-ativo-desc">
                                {simuladoAtivo.descricao ||
                                    "Responda todas as questões e clique em 'Entregar simulado'."}
                            </p>
                        </div>
                        <button type="button" onClick={limparSimuladoAtivo}>
                            Fechar
                        </button>
                    </div>

                    {loadingSimulado ? (
                        <p>Carregando simulado...</p>
                    ) : !simuladoAtivo.questoes ||
                    simuladoAtivo.questoes.length === 0 ? (
                        <p>Este simulado não tem questões cadastradas.</p>
                    ) : (
                        <>
                            {resultado && (
                                <div className="simulado-resultado">
                                    <p>
                                        Você acertou{" "}
                                        <strong>
                                            {resultado.acertos} de {resultado.total}
                                        </strong>{" "}
                                        questões.
                                    </p>
                                </div>
                            )}

                            <div className="simulado-questoes-lista">
                                {simuladoAtivo.questoes.map((q, idx) => {
                                    const gItem =
                                        resultado?.gabarito?.find(
                                            (g) => g.questaoId === q.id
                                        ) || null;
                                    const marcada =
                                        gItem?.marcada || respostas[q.id] || null;

                                    return (
                                        <div key={q.id} className="simulado-questao-box">
                                            <div className="simulado-questao-header">
                        <span className="simulado-questao-numero">
                          Questão {idx + 1}
                        </span>
                                                <span className="simulado-questao-meta">
                          {q.materia} • {q.nivel}
                        </span>
                                            </div>
                                            <p className="simulado-questao-enunciado">
                                                {q.enunciado}
                                            </p>

                                            <div className="alternativas-lista">
                                                {ALTERNATIVAS.map(({ letra, campo }) => {
                                                    const texto = q[campo];
                                                    if (!texto) return null;

                                                    let className = "alternativa-item";
                                                    if (entregue && gItem) {
                                                        if (letra === gItem.correta) {
                                                            className += " alternativa-correta";
                                                        } else if (letra === gItem.marcada) {
                                                            className += " alternativa-errada";
                                                        }
                                                    }

                                                    return (
                                                        <label
                                                            key={letra}
                                                            className={className}
                                                            onClick={() =>
                                                                selecionarAlternativa(q.id, letra)
                                                            }
                                                        >
                                                            <input
                                                                type="radio"
                                                                name={`sim-q-${q.id}`}
                                                                checked={marcada === letra}
                                                                readOnly
                                                            />
                                                            <span className="alternativa-letra">
                                {letra})
                              </span>
                                                            <span className="alternativa-texto">
                                {texto}
                              </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="simulado-footer">
                                <button
                                    type="button"
                                    onClick={entregarSimulado}
                                    disabled={entregue}
                                >
                                    {entregue ? "Simulado entregue" : "Entregar simulado"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Layout>
    );
}
