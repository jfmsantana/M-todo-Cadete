// src/pages/Redacoes.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { RedacoesAPI } from "../api/redacoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import "./Redacoes.css";

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

  const [form, setForm] = useState({ titulo: "", texto: "" });
  const [minhas, setMinhas] = useState([]);

  const [filtro, setFiltro] = useState("PENDENTE");
  const [lista, setLista] = useState([]);

  const [corrigindoId, setCorrigindoId] = useState(null);
  const [corrigirForm, setCorrigirForm] = useState({
    nota: "",
    feedback: "",
  });

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
        <div className="page-shell">
          <div className="page-header-row">
            <div>
              <h2 className="page-title">Redações</h2>
              <p className="page-subtitle">
                Envie textos como aluno e corrija como professor ou administrador.
              </p>
            </div>
          </div>

          {loading && <Loader />}
          {err && <ErrorMsg error={err} />}

          {isAluno && (
              <div className="card-elevated">
                <h3 className="card-title">Enviar nova redação</h3>
                <p className="card-subtitle">
                  Escreva sua redação e envie para correção.
                </p>
                <form
                    onSubmit={enviarRedacao}
                    className="redacao-form"
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
                  <button type="submit" className="btn-primary">
                    Enviar
                  </button>
                </form>

                <hr className="section-divider" />

                <h3 className="card-title">Minhas redações</h3>
                {minhas.length === 0 ? (
                    <p className="muted">Nenhuma redação enviada.</p>
                ) : (
                    <ul className="lista-redacoes">
                      {minhas.map((r) => (
                          <li key={r.id}>
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

          {isProfOuAdmin && (
              <div className="card-elevated">
                <div className="redacoes-toolbar">
                  <h3 className="card-title">Correções de redações</h3>
                  <select
                      className="input slim"
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                  >
                    <option value="PENDENTE">Pendentes</option>
                    <option value="CORRIGIDA">Corrigidas</option>
                    <option value="TODAS">Todas</option>
                  </select>
                  <button className="btn-ghost" onClick={carregar}>
                    Atualizar
                  </button>
                </div>

                {lista.length === 0 ? (
                    <p className="muted">Sem redações no filtro atual.</p>
                ) : (
                    <ul className="lista-correcoes">
                      {lista.map((r) => (
                          <li key={r.id} className="correcao-item">
                            <div className="correcao-header">
                              <div>
                                <strong>#{r.id}</strong> —{" "}
                                <strong>{r.titulo}</strong> — {r.status}
                                <br />
                                <small>
                                  Aluno: {r.aluno?.email || `ID ${r.aluno?.id}`}
                                </small>
                              </div>
                              {r.status === "PENDENTE" && (
                                  <button
                                      className="btn-primary"
                                      type="button"
                                      onClick={() => abrirCorrecao(r)}
                                  >
                                    Corrigir
                                  </button>
                              )}
                            </div>

                            <details className="correcao-details">
                              <summary>Ver texto</summary>
                              <pre className="correcao-texto">{r.texto}</pre>
                            </details>

                            {corrigindoId === r.id && (
                                <div className="correcao-panel">
                                  <h4>Aplicar nota e feedback</h4>
                                  <div className="correcao-form-grid">
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
                                    <div className="correcao-actions">
                                      <button
                                          onClick={confirmarCorrecao}
                                          type="button"
                                          className="btn-primary"
                                      >
                                        Salvar correção
                                      </button>
                                      <button
                                          onClick={cancelarCorrecao}
                                          type="button"
                                          className="btn-ghost"
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {r.status === "CORRIGIDA" && (
                                <div className="correcao-resumo">
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
