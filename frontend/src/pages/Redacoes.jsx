import { useEffect, useState } from "react";
import { RedacoesAPI } from "../api/redacoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function Redacoes() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ alunoId: 3, titulo: "", texto: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function carregar() {
    try {
      setLoading(true); setErr(null);
      const data = await RedacoesAPI.doAluno(form.alunoId);
      setLista(data);
    } catch (e) { setErr(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ carregar(); }, []);

  async function enviar(e) {
    e.preventDefault();
    try {
      await RedacoesAPI.criar(form.alunoId, form.titulo, form.texto);
      setForm(f=>({ ...f, titulo:"", texto:"" }));
      await carregar();
    } catch (e) { setErr(e); }
  }

  return (
    <div>
      <h2>Redações</h2>
      {loading ? <Loader/> : <ErrorMsg error={err}/>}
      <form onSubmit={enviar} style={{display:"grid", gap:8, maxWidth:600}}>
        <input value={form.titulo} required placeholder="Título" onChange={e=>setForm(f=>({...f,titulo:e.target.value}))}/>
        <textarea value={form.texto} required placeholder="Texto da redação" rows={8} onChange={e=>setForm(f=>({...f,texto:e.target.value}))}/>
        <button type="submit">Enviar</button>
      </form>

      <h3>Minhas redações</h3>
      <ul>
        {lista.map(r=>(
          <li key={r.id}>
            <strong>#{r.id}</strong> {r.titulo} — {r.status}
            {r.nota != null && <> — Nota: {r.nota} — Feedback: {r.feedback}</>}
          </li>
        ))}
      </ul>
    </div>
  );
}
