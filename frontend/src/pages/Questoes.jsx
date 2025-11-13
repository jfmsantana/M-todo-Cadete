import { useEffect, useState } from "react";
import { QuestoesAPI } from "../api/questoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

const MATERIAS = ["PORTUGUES", "MATEMATICA", "INGLES"];
const NIVEIS = ["FIXACAO", "NIVELAMENTO", "CONCURSO"];

export default function Questoes() {
  const [materia, setMateria] = useState("");
  const [nivel, setNivel] = useState("");
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

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

  async function carregar() {
    try {
      setLoading(true);
      setErr(null);
      const m = materia || undefined;
      const n = nivel || undefined;
      const data = await QuestoesAPI.listar(m, n);
      console.log("🔍 Retorno do backend:", data);
      setLista(data);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, [materia, nivel]);

  async function criar(e) {
    e.preventDefault();
    try {
      setErr(null);
      await QuestoesAPI.criar({ ...form });
      setForm({
        ...form,
        enunciado: "",
        alternativaA: "",
        alternativaB: "",
        alternativaC: "",
        alternativaD: "",
      });
      await carregar();
    } catch (e) {
      setErr(e);
    }
  }

  function limparFormulario() {
    setForm((f) => ({
      ...f,
      enunciado: "",
      alternativaA: "",
      alternativaB: "",
      alternativaC: "",
      alternativaD: "",
    }));
  }

  return (
      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Banco de Questões</h1>

        {err && (
            <div style={{ marginBottom: 16 }}>
              <ErrorMsg error={err} />
            </div>
        )}

        {/* Filtros */}
        <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
        >
          <h3 style={{ marginTop: 0 }}>Filtros</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <select
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                style={{ padding: 8, minWidth: 160 }}
            >
              <option value="">Todas as matérias</option>
              {MATERIAS.map((m) => (
                  <option key={m}>{m}</option>
              ))}
            </select>

            <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                style={{ padding: 8, minWidth: 160 }}
            >
              <option value="">Todos os níveis</option>
              {NIVEIS.map((n) => (
                  <option key={n}>{n}</option>
              ))}
            </select>

            <button type="button" onClick={carregar} style={{ padding: "8px 16px" }}>
              Atualizar
            </button>
          </div>
        </div>

        {/* Criar questão */}
        <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
        >
          <h3 style={{ marginTop: 0 }}>Criar questão</h3>
          <form
              onSubmit={criar}
              style={{ display: "grid", gap: 10 }}
          >
          <textarea
              rows={3}
              placeholder="Enunciado"
              value={form.enunciado}
              onChange={(e) =>
                  setForm((f) => ({ ...f, enunciado: e.target.value }))
              }
              style={{ padding: 8 }}
          />

            <input
                placeholder="Alternativa A"
                value={form.alternativaA}
                onChange={(e) =>
                    setForm((f) => ({ ...f, alternativaA: e.target.value }))
                }
                style={{ padding: 8 }}
            />
            <input
                placeholder="Alternativa B"
                value={form.alternativaB}
                onChange={(e) =>
                    setForm((f) => ({ ...f, alternativaB: e.target.value }))
                }
                style={{ padding: 8 }}
            />
            <input
                placeholder="Alternativa C"
                value={form.alternativaC}
                onChange={(e) =>
                    setForm((f) => ({ ...f, alternativaC: e.target.value }))
                }
                style={{ padding: 8 }}
            />
            <input
                placeholder="Alternativa D"
                value={form.alternativaD}
                onChange={(e) =>
                    setForm((f) => ({ ...f, alternativaD: e.target.value }))
                }
                style={{ padding: 8 }}
            />

            <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 10,
                }}
            >
              <select
                  value={form.correta}
                  onChange={(e) =>
                      setForm((f) => ({ ...f, correta: e.target.value }))
                  }
                  style={{ padding: 8 }}
              >
                {["A", "B", "C", "D"].map((a) => (
                    <option key={a}>{a}</option>
                ))}
              </select>

              <select
                  value={form.materia}
                  onChange={(e) =>
                      setForm((f) => ({ ...f, materia: e.target.value }))
                  }
                  style={{ padding: 8 }}
              >
                {MATERIAS.map((m) => (
                    <option key={m}>{m}</option>
                ))}
              </select>

              <select
                  value={form.nivel}
                  onChange={(e) =>
                      setForm((f) => ({ ...f, nivel: e.target.value }))
                  }
                  style={{ padding: 8 }}
              >
                {NIVEIS.map((n) => (
                    <option key={n}>{n}</option>
                ))}
              </select>
            </div>

            <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 8,
                }}
            >
              <button
                  type="button"
                  onClick={limparFormulario}
                  style={{ padding: "8px 16px", background: "transparent" }}
              >
                Limpar
              </button>
              <button type="submit" style={{ padding: "8px 16px" }}>
                Salvar
              </button>
            </div>
          </form>
        </div>

        {/* Lista de questões */}
        <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
        >
          <h3 style={{ marginTop: 0 }}>Questões</h3>

          {loading ? (
              <Loader />
          ) : lista.length === 0 ? (
              <p style={{ color: "#888" }}>Nenhuma questão.</p>
          ) : (
              <ul style={{ paddingLeft: 18, lineHeight: 1.7 }}>
                {lista.map((q) => (
                    <li key={q.id}>
                      <strong>#{q.id}</strong>{" "}
                      <span style={{ opacity: 0.8 }}>
                  [{q.materia} / {q.nivel}]
                </span>{" "}
                      — {q.enunciado}
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );
}
