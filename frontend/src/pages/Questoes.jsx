// src/pages/Questoes.jsx
import { useEffect, useState } from "react";
import { QuestoesAPI } from "../api/questoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
import Layout from "../components/Layout";
import "./Questoes.css";

const MATERIAS = ["PORTUGUES", "MATEMATICA", "INGLES"];
const NIVEIS = ["FIXACAO", "NIVELAMENTO", "CONCURSO"];

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

export default function Questoes() {
  const [materia, setMateria] = useState("");
  const [nivel, setNivel] = useState("");
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    enunciado: "",
    alternativaA: "",
    alternativaB: "",
    alternativaC: "",
    alternativaD: "",
    correta: "A",
    materia: "PORTUGUES",
    nivel: "FIXACAO",
  });

  const [user, setUser] = useState(null);
  const [selecionadas, setSelecionadas] = useState({});
  const [corrigidas, setCorrigidas] = useState({});

  useEffect(() => {
    const u = getUsuarioLogado();
    if (u) setUser(u);
  }, []);

  const isGestor =
      user && (user.perfil === "ADMIN" || user.perfil === "PROFESSOR");

  async function carregar() {
    try {
      setLoading(true);
      setErr(null);
      const m = materia || undefined;
      const n = nivel || undefined;
      const data = await QuestoesAPI.listar(m, n);
      setLista(data);
      setSelecionadas({});
      setCorrigidas({});
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materia, nivel]);

  async function criar(e) {
    e.preventDefault();
    try {
      setErr(null);
      await QuestoesAPI.criar({ ...form });
      setForm((f) => ({
        ...f,
        enunciado: "",
        alternativaA: "",
        alternativaB: "",
        alternativaC: "",
        alternativaD: "",
      }));
      await carregar();
    } catch (e) {
      setErr(e);
    }
  }

  function selecionarAlternativa(idQuestao, letra) {
    if (corrigidas[idQuestao]) return;
    setSelecionadas((prev) => ({ ...prev, [idQuestao]: letra }));
  }

  async function entregarQuestao(q) {
    const marcada = selecionadas[q.id];
    if (!marcada) {
      alert("Escolha uma alternativa antes de entregar.");
      return;
    }
    if (!user) {
      alert("Faça login novamente.");
      return;
    }

    setCorrigidas((prev) => ({ ...prev, [q.id]: true }));

    try {
      const resp = await fetch(
          "http://localhost:8080/api/questoes/responder",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuarioId: user.id,
              questaoId: q.id,
              alternativa: marcada,
            }),
          }
      );

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Erro ao responder questão:", resp.status, text);
        return;
      }

      const data = await resp.json();
      setStats(data);
    } catch (e) {
      console.error("Erro na requisição /responder:", e);
    }
  }

  return (
      <Layout title="Banco de Questões">
        <div className="page-shell">
          <div className="page-header-row">
            <div>
              <h2 className="page-title">Banco de Questões</h2>
              <p className="page-subtitle">
                Filtre, cadastre e resolva questões de forma organizada.
              </p>
            </div>
          </div>

          <div className="grid grid-2">
            {/* Filtros */}
            <div className="card card-elevated">
              <h3 className="card-title">Filtros</h3>
              <p className="card-subtitle">
                Selecione matéria e nível para encontrar as questões certas.
              </p>
              <div className="card-row">
                <select
                    className="input"
                    value={materia}
                    onChange={(e) => setMateria(e.target.value)}
                >
                  <option value="">Todas as matérias</option>
                  {MATERIAS.map((m) => (
                      <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                    className="input"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                >
                  <option value="">Todos os níveis</option>
                  {NIVEIS.map((n) => (
                      <option key={n}>{n}</option>
                  ))}
                </select>
                <button type="button" className="btn-primary" onClick={carregar}>
                  Atualizar
                </button>
              </div>
            </div>

            {/* Criar questão – somente gestor */}
            {isGestor && (
                <div className="card card-elevated">
                  <h3 className="card-title">Criar questão</h3>
                  <p className="card-subtitle">
                    Preencha o enunciado, alternativas e marque a correta.
                  </p>
                  <form
                      onSubmit={criar}
                      className="grid"
                      style={{ gap: 10, alignItems: "flex-start" }}
                  >
                <textarea
                    className="input"
                    rows={3}
                    placeholder="Enunciado"
                    value={form.enunciado}
                    onChange={(e) =>
                        setForm((f) => ({ ...f, enunciado: e.target.value }))
                    }
                />
                    <input
                        className="input"
                        placeholder="Alternativa A"
                        value={form.alternativaA}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, alternativaA: e.target.value }))
                        }
                    />
                    <input
                        className="input"
                        placeholder="Alternativa B"
                        value={form.alternativaB}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, alternativaB: e.target.value }))
                        }
                    />
                    <input
                        className="input"
                        placeholder="Alternativa C"
                        value={form.alternativaC}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, alternativaC: e.target.value }))
                        }
                    />
                    <input
                        className="input"
                        placeholder="Alternativa D"
                        value={form.alternativaD}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, alternativaD: e.target.value }))
                        }
                    />

                    <div className="triple-row">
                      <select
                          className="input"
                          value={form.correta}
                          onChange={(e) =>
                              setForm((f) => ({ ...f, correta: e.target.value }))
                          }
                      >
                        {["A", "B", "C", "D"].map((a) => (
                            <option key={a}>{a}</option>
                        ))}
                      </select>
                      <select
                          className="input"
                          value={form.materia}
                          onChange={(e) =>
                              setForm((f) => ({ ...f, materia: e.target.value }))
                          }
                      >
                        {MATERIAS.map((m) => (
                            <option key={m}>{m}</option>
                        ))}
                      </select>
                      <select
                          className="input"
                          value={form.nivel}
                          onChange={(e) =>
                              setForm((f) => ({ ...f, nivel: e.target.value }))
                          }
                      >
                        {NIVEIS.map((n) => (
                            <option key={n}>{n}</option>
                        ))}
                      </select>
                    </div>

                    <div className="card-actions-right">
                      <button
                          type="button"
                          className="btn-ghost"
                          onClick={() =>
                              setForm((f) => ({
                                ...f,
                                enunciado: "",
                                alternativaA: "",
                                alternativaB: "",
                                alternativaC: "",
                                alternativaD: "",
                              }))
                          }
                      >
                        Limpar
                      </button>
                      <button type="submit" className="btn-primary">
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
            )}
          </div>

          {/* Lista / resolução */}
          <div className="card card-elevated" style={{ marginTop: 16 }}>
            <h3 className="card-title">Questões</h3>

            {err && (
                <div style={{ marginBottom: 8 }}>
                  <ErrorMsg error={err} />
                </div>
            )}

            {loading ? (
                <Loader />
            ) : lista.length === 0 ? (
                <p className="muted">Nenhuma questão.</p>
            ) : isGestor ? (
                <ul className="lista-gestor">
                  {lista.map((q) => (
                      <li key={q.id}>
                        <strong>#{q.id}</strong>{" "}
                        <span className="tag-light">
                    [{q.materia} / {q.nivel}]
                  </span>{" "}
                        — {q.enunciado}
                      </li>
                  ))}
                </ul>
            ) : (
                <div className="questoes-aluno">
                  {stats && (
                      <div className="questoes-stats">
                        <p>
                          Respondidas:{" "}
                          <strong>{stats.totalRespondidas}</strong> — Acertos:{" "}
                          <strong>{stats.totalAcertos}</strong> — Aproveitamento:{" "}
                          <strong>{stats.aproveitamento.toFixed(1)}%</strong>
                        </p>
                      </div>
                  )}

                  {lista.map((q) => {
                    const marcada = selecionadas[q.id];
                    const corrigida = !!corrigidas[q.id];
                    const acertou = corrigida && marcada && marcada === q.correta;

                    return (
                        <div key={q.id} className="questao-box">
                          <div className="questao-header">
                      <span className="questao-tag">
                        {q.materia} • {q.nivel}
                      </span>
                            <span className="questao-id">#{q.id}</span>
                          </div>

                          <p className="questao-enunciado">{q.enunciado}</p>

                          <div className="alternativas-lista">
                            {ALTERNATIVAS.map(({ letra, campo }) => {
                              const texto = q[campo];
                              if (!texto) return null;

                              let className = "alternativa-item";
                              if (corrigida) {
                                if (letra === q.correta) {
                                  className += " alternativa-correta";
                                } else if (letra === marcada) {
                                  className += " alternativa-errada";
                                }
                              }

                              return (
                                  <label
                                      key={letra}
                                      className={className}
                                      onClick={() => selecionarAlternativa(q.id, letra)}
                                  >
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        checked={marcada === letra}
                                        readOnly
                                    />
                                    <span className="alternativa-letra">{letra})</span>
                                    <span className="alternativa-texto">{texto}</span>
                                  </label>
                              );
                            })}
                          </div>

                          <div className="questao-footer">
                            <button
                                type="button"
                                onClick={() => entregarQuestao(q)}
                                disabled={corrigida}
                            >
                              {corrigida ? "Entregue" : "Entregar"}
                            </button>

                            {corrigida && (
                                <span
                                    className={
                                      acertou
                                          ? "msg-resultado acerto"
                                          : "msg-resultado erro"
                                    }
                                >
                          {acertou
                              ? "Você acertou!"
                              : `Você errou. Resposta correta: ${q.correta}.`}
                        </span>
                            )}
                          </div>
                        </div>
                    );
                  })}
                </div>
            )}
          </div>
        </div>
      </Layout>
  );
}
