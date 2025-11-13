import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { RedacoesAPI } from "../api/redacoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function Redacao() {
  const { user } = useAuth(); // { id, perfil }
  const isAluno = user?.perfil === "ALUNO";
  const isProfOuAdmin = user?.perfil === "PROFESSOR" || user?.perfil === "ADMIN";

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

  // Carregamento
  async function carregar() {
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
        if (filtro === "PENDENTE") filtrada = data.filter(r => r.status === "PENDENTE");
        if (filtro === "CORRIGIDA") filtrada = data.filter(r => r.status === "CORRIGIDA");
        setLista(filtrada.sort((a,b)=> new Date(b.id) - new Date(a.id))); // simples
      }
    } catch (e) {
      setErr(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); /* eslint-disable-next-line */ }, [user?.id, user?.perfil, filtro]);

  // ALUNO: enviar
  async function enviarRedacao(e) {
    e.preventDefault();
    try {
      setErr(null);
      await RedacoesAPI.criar(user.id, form.titulo.trim(), form.texto.trim());
      setForm({ titulo: "", texto: "" });
      await carregar();
      alert("Redação enviada!");
    } catch (e) {
      setErr(e.response?.data || e.message);
    }
  }

  // PROF/ADMIN: abrir modal inline de correção
  function abrirCorrecao(r) {
    setCorrigindoId(r.id);
    setCorrigirForm({
      nota: r.nota ?? "",
      feedback: r.feedback ?? ""
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
      if (Number.isNaN(notaNum)) { alert("Informe uma nota numérica"); return; }
      await RedacoesAPI.corrigir(corrigindoId, user.id, notaNum, corrigirForm.feedback);
      cancelarCorrecao();
      await carregar();
      alert("Redação corrigida!");
    } catch (e) {
      setErr(e.response?.data || e.message);
    }
  }

  return (
      <div style={{ padding: 20, maxWidth: 900 }}>
        <h2>Redação</h2>
        {loading ? <Loader/> : <ErrorMsg error={err}/>}

        {/* BLOCO ALUNO */}
        {isAluno && (
            <>
              <h3>Enviar nova redação</h3>
              <form onSubmit={enviarRedacao} style={{ display: "grid", gap: 10, maxWidth: 700 }}>
                <input
                    required
                    placeholder="Título"
                    value={form.titulo}
                    onChange={(e)=>setForm(f=>({...f, titulo: e.target.value}))}
                />
                <textarea
                    required
                    placeholder="Texto da redação"
                    rows={8}
                    value={form.texto}
                    onChange={(e)=>setForm(f=>({...f, texto: e.target.value}))}
                />
                <button type="submit">Enviar</button>
              </form>

              <hr />
              <h3>Minhas redações</h3>
              {minhas.length === 0 ? <p>Nenhuma redação enviada.</p> : (
                  <ul>
                    {minhas.map(r=>(
                        <li key={r.id} style={{ marginBottom: 12 }}>
                          <strong>#{r.id}</strong> — {r.titulo} — {r.status}
                          {r.status === "CORRIGIDA" && (
                              <>
                                {" "}— Nota: <strong>{r.nota}</strong>
                                {r.feedback && <> — Feedback: {r.feedback}</>}
                              </>
                          )}
                        </li>
                    ))}
                  </ul>
              )}
            </>
        )}

        {/* BLOCO PROFESSOR/ADMIN */}
        {isProfOuAdmin && (
            <>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <h3 style={{ margin: 0 }}>Correções</h3>
                <select value={filtro} onChange={(e)=>setFiltro(e.target.value)}>
                  <option value="PENDENTE">Pendentes</option>
                  <option value="CORRIGIDA">Corrigidas</option>
                  <option value="TODAS">Todas</option>
                </select>
                <button onClick={carregar}>Atualizar</button>
              </div>

              {lista.length === 0 ? <p>Sem itens.</p> : (
                  <ul style={{ listStyle:"none", padding:0 }}>
                    {lista.map(r=>(
                        <li key={r.id} style={{ border:"1px solid #eee", borderRadius:8, padding:12, marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                            <div>
                              <strong>#{r.id}</strong> — <strong>{r.titulo}</strong> — {r.status}<br/>
                              <small>Aluno: {r.aluno?.email || r.aluno?.id}</small>
                            </div>
                            {r.status === "PENDENTE" && (
                                <button onClick={()=>abrirCorrecao(r)}>Corrigir</button>
                            )}
                          </div>

                          <details style={{ marginTop:8 }}>
                            <summary>Ver texto</summary>
                            <pre style={{ whiteSpace:"pre-wrap", background:"#fafafa", padding:10, borderRadius:6 }}>{r.texto}</pre>
                          </details>

                          {corrigindoId === r.id && (
                              <div style={{ marginTop:12, background:"#f8f8ff", padding:12, borderRadius:8 }}>
                                <h4>Aplicar nota e feedback</h4>
                                <div style={{ display:"grid", gap:8, maxWidth:500 }}>
                                  <input
                                      type="number"
                                      step="0.1"
                                      placeholder="Nota (0 a 10)"
                                      value={corrigirForm.nota}
                                      onChange={(e)=>setCorrigirForm(f=>({ ...f, nota: e.target.value }))}
                                  />
                                  <textarea
                                      rows={4}
                                      placeholder="Feedback do professor"
                                      value={corrigirForm.feedback}
                                      onChange={(e)=>setCorrigirForm(f=>({ ...f, feedback: e.target.value }))}
                                  />
                                  <div style={{ display:"flex", gap:8 }}>
                                    <button onClick={confirmarCorrecao} type="button">Salvar correção</button>
                                    <button onClick={cancelarCorrecao} type="button">Cancelar</button>
                                  </div>
                                </div>
                              </div>
                          )}

                          {r.status === "CORRIGIDA" && (
                              <div style={{ marginTop:8 }}>
                                <strong>Nota:</strong> {r.nota}{" "}
                                {r.feedback && <>— <strong>Feedback:</strong> {r.feedback}</>}
                              </div>
                          )}
                        </li>
                    ))}
                  </ul>
              )}
            </>
        )}
      </div>
  );
}
