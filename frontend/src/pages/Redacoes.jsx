// src/pages/Redacoes.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { RedacoesAPI } from "../api/redacoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem("usuarioLogado");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Redacoes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // ALUNO form
  const [form, setForm] = useState({ titulo: "", texto: "" });
  const [minhas, setMinhas] = useState([]);

  // PROF/ADMIN listagem e correção
  const [filtro, setFiltro] = useState("PENDENTE"); // PENDENTE | CORRIGIDA | TODAS
  const [lista, setLista] = useState([]);

  // Estado de correção
  const [corrigindoId, setCorrigindoId] = useState(null);
  const [corrigirForm, setCorrigirForm] = useState({ nota: "", feedback: "" });

  useEffect(() => {
    const u = getUsuarioLogado();
    if (u) setUser(u);
  }, []);

  const isAluno = user?.perfil === "ALUNO";
  const isProfOuAdmin =
      user?.perfil === "PROFESSOR" || user?.perfil === "ADMIN";

  async function carregar() {
    if (!user) return;
    try {
      setLoading(true);
      setErr(null);

      if (isAluno) {
        const data = await RedacoesAPI.doAluno(user.id);
        setMinhas(data);
      }

      if (isProfOuAdmin) {
        const data = await RedacoesAPI.todas();
        let filtrada = data;
        if (filtro === "PENDENTE")
          filtrada = data.filter((r) => r.status === "PENDENTE");
        if (filtro === "CORRIGIDA")
          filtrada = data.filter((r) => r.status === "CORRIGIDA");
        setLista(filtrada);
      }
    } catch (e) {
      setErr(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.perfil, filtro]);

  // ALUNO: enviar
  async function enviarRedacao(e) {
    e.preventDefault();
    try {
      setErr(null);
      await RedacoesAPI.criar(
          user.id,
          form.titulo.trim(),
          form.texto.trim()
      );
      setForm({ titulo: "", texto: "" });
      await carregar();
      alert("Redação enviada!");
    } catch (e) {
      setErr(e.response?.data || e.message);
    }
  }

  // PROF/ADMIN: correção
  function abrirCorrecao(r) {
    setCorrigindoId(r.id);
    setCorrigirForm({
      nota: r.nota ?? "",
      feedback: r.feedback ?? "",
    });
  }
  function cancelarCorrecao() {
    setCorrigindoId(null);
    setCorrigirForm({ nota: "", feedback: "" });
  }
  async function confirmarCorrecao() {
    try {
      setErr(null);
      const notaNum = Number(corrigirForm.nota);
      if (Number.isNaN(notaNum)) {
        alert("Informe uma nota numérica");
        return;
      }
      await RedacoesAPI.corrigir(
          corrigindoId,
          user.id,
          notaNum,
          corrigirForm.feedback
      );
      cancelarCorrecao();
      await carregar();
      alert("Redação corrigida!");
    } catch (e) {
      setErr(e.response?.data || e.message);
    }
  }

  return (
      <Layout title="Redações">
        <div className="page-root">
          {/* HERO */}
          <section className="page-hero page-hero--redacoes">
            <div className="page-hero-main">
              <h2>Redações</h2>
              <p>
                Envie suas produções (aluno) ou corrija com nota e feedback
                detalhado (professor/admin).
              </p>
            </div>
            <div className="page-hero-badge">✍️ Produção de texto</div>
          </section>

          {/* Estado global */}
          {loading && <Loader />}
          {err && <ErrorMsg error={err} />}

          {/* BLOCO ALUNO */}
          {isAluno && (
              <div className="card section-card">
                <h3>Enviar nova redação</h3>
                <form
                    onSubmit={enviarRedacao}
                    style={{
                      display: "grid",
                      gap: 10,
                      maxWidth: 700,
                      marginTop: 8,
                    }}
                >
                  <input
                      className="input"
                      required
                      placeholder="Título"
                      value={form.titulo}
                      onChange={(e) =>
                          setForm((f) => ({ ...f, titulo: e.target.value }))
                      }
                  />
                  <textarea
                      className="input"
                      required
                      placeholder="Texto da redação"
                      rows={8}
                      value={form.texto}
                      onChange={(e) =>
                          setForm((f) => ({ ...f, texto: e.target.value }))
                      }
                  />
                  <button type="submit">Enviar</button>
                </form>

                <hr style={{ margin: "16px 0" }} />

                <h3>Minhas redações</h3>
                {minhas.length === 0 ? (
                    <p>Nenhuma redação enviada.</p>
                ) : (
                    <ul>
                      {minhas.map((r) => (
                          <li key={r.id} style={{ marginBottom: 12 }}>
                            <strong>#{r.id}</strong> — {r.titulo} — {r.status}
                            {r.status === "CORRIGIDA" && (
                                <>
                                  {" "}
                                  — Nota: <strong>{r.nota}</strong>
                                  {r.feedback && <> — Feedback: {r.feedback}</>}
                                </>
                            )}
                          </li>
                      ))}
                    </ul>
                )}
              </div>
          )}

          {/* BLOCO PROFESSOR/ADMIN */}
          {isProfOuAdmin && (
              <div className="card section-card">
                <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                >
                  <h3 style={{ margin: 0 }}>Correções de redações</h3>
                  <select
                      className="input"
                      style={{ maxWidth: 180 }}
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                  >
                    <option value="PENDENTE">Pendentes</option>
                    <option value="CORRIGIDA">Corrigidas</option>
                    <option value="TODAS">Todas</option>
                  </select>
                  <button onClick={carregar}>Atualizar</button>
                </div>

                {lista.length === 0 ? (
                    <p>Sem redações no filtro atual.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {lista.map((r) => (
                          <li
                              key={r.id}
                              className="list-item-card"
                          >
                            <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                            >
                              <div>
                                <strong>#{r.id}</strong> —{" "}
                                <strong>{r.titulo}</strong> — {r.status}
                                <br />
                                <small>
                                  Aluno: {r.aluno?.email || `ID ${r.aluno?.id}`}
                                </small>
                              </div>
                              {r.status === "PENDENTE" && (
                                  <button onClick={() => abrirCorrecao(r)}>
                                    Corrigir
                                  </button>
                              )}
                            </div>

                            <details style={{ marginTop: 8 }}>
                              <summary>Ver texto</summary>
                              <pre
                                  style={{
                                    whiteSpace: "pre-wrap",
                                    background: "#fafafa",
                                    padding: 10,
                                    borderRadius: 6,
                                    marginTop: 6,
                                  }}
                              >
                        {r.texto}
                      </pre>
                            </details>

                            {corrigindoId === r.id && (
                                <div
                                    style={{
                                      marginTop: 12,
                                      background: "#f8f8ff",
                                      padding: 12,
                                      borderRadius: 8,
                                    }}
                                >
                                  <h4>Aplicar nota e feedback</h4>
                                  <div
                                      style={{
                                        display: "grid",
                                        gap: 8,
                                        maxWidth: 500,
                                      }}
                                  >
                                    <input
                                        className="input"
                                        type="number"
                                        step="0.1"
                                        placeholder="Nota (0 a 10)"
                                        value={corrigirForm.nota}
                                        onChange={(e) =>
                                            setCorrigirForm((f) => ({
                                              ...f,
                                              nota: e.target.value,
                                            }))
                                        }
                                    />
                                    <textarea
                                        className="input"
                                        rows={4}
                                        placeholder="Feedback do professor"
                                        value={corrigirForm.feedback}
                                        onChange={(e) =>
                                            setCorrigirForm((f) => ({
                                              ...f,
                                              feedback: e.target.value,
                                            }))
                                        }
                                    />
                                    <div
                                        style={{
                                          display: "flex",
                                          gap: 8,
                                        }}
                                    >
                                      <button onClick={confirmarCorrecao} type="button">
                                        Salvar correção
                                      </button>
                                      <button onClick={cancelarCorrecao} type="button">
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {r.status === "CORRIGIDA" && (
                                <div style={{ marginTop: 8 }}>
                                  <strong>Nota:</strong> {r.nota}{" "}
                                  {r.feedback && (
                                      <>
                                        — <strong>Feedback:</strong> {r.feedback}
                                      </>
                                  )}
                                </div>
                            )}
                          </li>
                      ))}
                    </ul>
                )}
              </div>
          )}
        </div>
      </Layout>
  );
}
