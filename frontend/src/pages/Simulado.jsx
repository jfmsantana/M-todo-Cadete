import { useEffect, useState } from "react";
import { QuestoesAPI } from "../api/questoes";
import { SimuladosAPI, TentativasAPI } from "../api/simulados";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function Simulado() {
  const [questoes, setQuestoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [titulo, setTitulo] = useState("Simulado Cadete");
  const [simulados, setSimulados] = useState([]);
  const [tentativa, setTentativa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function carregar() {
    try {
      setLoading(true); setErr(null);
      const [qs, sims] = await Promise.all([
        QuestoesAPI.listar(),
        SimuladosAPI.listar(),
      ]);
      setQuestoes(qs);
      setSimulados(sims);
    } catch (e) { setErr(e); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ carregar(); }, []);

  function toggleQuestao(id) {
    setSelecionadas(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);
  }

  async function criarSimulado() {
    try {
      setErr(null);
      await SimuladosAPI.criar(titulo, selecionadas);
      setSelecionadas([]);
      setTitulo("Simulado Cadete");
      await carregar();
      alert("Simulado criado!");
    } catch (e) { setErr(e); }
  }

  // MVP: alunoId fixo 1 (depois integramos login)
  async function iniciar(simuladoId) {
    const t = await TentativasAPI.iniciar(simuladoId, 1);
    setTentativa(t);
  }

  async function marcar(questaoId, marcada) {
    if (!tentativa) return;
    const respostas = [{ questaoId, marcada }];
    const t = await TentativasAPI.responder(tentativa.id, respostas);
    setTentativa(t); // não traz gabarito (EM_ANDAMENTO)
  }

  async function entregar() {
    if (!tentativa) return;
    const r = await TentativasAPI.entregar(tentativa.id);
    // Ao entregar, backend devolve gabarito
    alert(`Entregue! ${r.acertos}/${r.total} acertos.`);
    // Você pode guardar r.gabarito em um estado para exibir:
    setTentativa({ ...tentativa, status:"ENTREGUE", gabarito: r.gabarito, acertos: r.acertos, total: r.total });
  }

  return (
    <div>
      <h2>Simulados</h2>
      {loading ? <Loader/> : <ErrorMsg error={err}/>}
      <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <div>
          <h3>Montar simulado (professor/admin)</h3>
          <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Título" />
          <div style={{maxHeight:240, overflow:"auto", border:"1px solid #ddd", padding:8}}>
            {questoes.map(q=>(
              <label key={q.id} style={{display:"block"}}>
                <input
                  type="checkbox"
                  checked={selecionadas.includes(q.id)}
                  onChange={()=>toggleQuestao(q.id)}
                />
                #{q.id} [{q.materia}/{q.nivel}] {q.enunciado}
              </label>
            ))}
          </div>
          <button disabled={selecionadas.length===0} onClick={criarSimulado}>Criar simulado</button>
        </div>

        <div>
          <h3>Simulados existentes</h3>
          <ul>
            {simulados.map(s=>(
              <li key={s.id}>
                <strong>#{s.id}</strong> {s.titulo} — {s.questoes?.length || 0} questões
                <button onClick={()=>iniciar(s.id)} style={{marginLeft:8}}>Iniciar (Aluno)</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr />
      <h3>Execução do simulado (Aluno)</h3>
      {!tentativa ? <p>Nenhum simulado iniciado.</p> : (
        <div>
          <p><strong>Tentativa:</strong> #{tentativa.id} — Status: {tentativa.status}</p>
          <p>Dica: clique para marcar A/B/C/D. O gabarito **só aparece na entrega**.</p>

          <ol>
            {(tentativa.respostas || []).map(r=>{
              const q = (tentativa.simulado?.questoes || []).find(qq => qq.id === r.questao.id) || r.questao;
              const marcada = r.marcada?.trim();
              const gabarito = tentativa.gabarito?.find(g => g.questaoId === q.id);

              return (
                <li key={q.id} style={{marginBottom:16}}>
                  <div><strong>#{q.id}</strong> {q.enunciado}</div>
                  <div style={{display:"flex", gap:8, marginTop:6}}>
                    {["A","B","C","D"].map((alt, idx)=>{
                      const texto = q["alternativa"+alt];
                      const isMarcada = marcada === alt;
                      // Se entregue, colorir correta em verde e, se errou, marcada em vermelho
                      let style={};
                      if (tentativa.status==="ENTREGUE" && gabarito) {
                        if (gabarito.correta === alt) style={ background:"rgba(0,200,0,0.15)" };
                        if (!gabarito.acertou && isMarcada && gabarito.correta !== alt) style={ background:"rgba(200,0,0,0.15)" };
                      } else if (isMarcada) {
                        style={ border:"1px solid #333" };
                      }
                      return (
                        <button key={alt} onClick={()=>marcar(q.id, alt)} style={style}>
                          {alt}) {texto}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>

          {tentativa.status !== "ENTREGUE" ? (
            <button onClick={entregar}>Entregar simulado</button>
          ) : (
            <p><strong>Resultado:</strong> {tentativa.acertos}/{tentativa.total} (gabarito exibido acima)</p>
          )}
        </div>
      )}
    </div>
  );
}
