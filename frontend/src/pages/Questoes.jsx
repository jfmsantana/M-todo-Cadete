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

  useEffect(() => { carregar(); }, [materia, nivel]);

  async function criar(e) {
    e.preventDefault();
    try {
      setErr(null);
      await QuestoesAPI.criar({ ...form });
      setForm({ ...form, enunciado: "", alternativaA:"", alternativaB:"", alternativaC:"", alternativaD:"" });
      await carregar();
    } catch (e) {
      setErr(e);
    }
  }

  return (
    <div>
      <h2>Banco de Questões</h2>
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <select value={materia} onChange={e=>setMateria(e.target.value)}>
          <option value="">Todas as matérias</option>
          {MATERIAS.map(m=> <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={nivel} onChange={e=>setNivel(e.target.value)}>
          <option value="">Todos os níveis</option>
          {NIVEIS.map(n=> <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={carregar}>Atualizar</button>
      </div>

      <h3>Criar questão</h3>
      <form onSubmit={criar} style={{ display:"grid", gap:8, maxWidth:600 }}>
        <textarea required placeholder="Enunciado" value={form.enunciado} onChange={e=>setForm(f=>({...f,enunciado:e.target.value}))}/>
        <input required placeholder="Alternativa A" value={form.alternativaA} onChange={e=>setForm(f=>({...f,alternativaA:e.target.value}))}/>
        <input required placeholder="Alternativa B" value={form.alternativaB} onChange={e=>setForm(f=>({...f,alternativaB:e.target.value}))}/>
        <input required placeholder="Alternativa C" value={form.alternativaC} onChange={e=>setForm(f=>({...f,alternativaC:e.target.value}))}/>
        <input required placeholder="Alternativa D" value={form.alternativaD} onChange={e=>setForm(f=>({...f,alternativaD:e.target.value}))}/>
        <label>
          Correta:
          <select value={form.correta} onChange={e=>setForm(f=>({...f,correta:e.target.value}))}>
            {["A","B","C","D"].map(a=> <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label>
          Matéria:
          <select value={form.materia} onChange={e=>setForm(f=>({...f,materia:e.target.value}))}>
            {MATERIAS.map(m=> <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label>
          Nível:
          <select value={form.nivel} onChange={e=>setForm(f=>({...f,nivel:e.target.value}))}>
            {NIVEIS.map(n=> <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button type="submit">Salvar</button>
      </form>

      <hr />
      <h3>Questões</h3>
      {loading ? <Loader/> : <ErrorMsg error={err} />}
      <ul>
        {lista.map(q=>(
          <li key={q.id}>
            <strong>#{q.id}</strong> [{q.materia} / {q.nivel}] {q.enunciado}
          </li>
        ))}
      </ul>
    </div>
  );
}
