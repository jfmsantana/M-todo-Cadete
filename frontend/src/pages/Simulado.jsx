import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SimuladosAPI, TentativasAPI } from "../api/simulados";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function Simulado() {
  const { id } = useParams();              // simuladoId da URL
  const [simulado, setSimulado] = useState(null);
  const [tentativa, setTentativa] = useState(null);
  const [respostas, setRespostas] = useState({}); // { questaoId: "A"|"B"|"C"|"D" }
  const [resultado, setResultado] = useState(null); // status final com acertos etc
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // TODO: substituir por usuário logado quando tivermos auth
  const alunoId = 3;

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setErr(null);
        const s = await SimuladosAPI.buscar(id);
        setSimulado(s);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id]);

  async function iniciar() {
    try {
      setErr(null);
      const t = await TentativasAPI.iniciar(simulado.id, alunoId);
      setTentativa(t); // { id, simuladoId, ... }
    } catch (e) {
      setErr(e);
    }
  }

  function selecionar(idQuestao, letra) {
    setRespostas(prev => ({ ...prev, [idQuestao]: letra }));
  }

  async function salvarRespostas() {
    if (!tentativa) return;
    try {
      setErr(null);
      await TentativasAPI.responder(tentativa.id, respostas);
      alert("Respostas salvas!");
    } catch (e) {
      setErr(e);
    }
  }

  async function entregar() {
    if (!tentativa) return;
    try {
      setErr(null);
      await TentativasAPI.responder(tentativa.id, respostas); // garante último estado
      await TentativasAPI.entregar(tentativa.id);
      const st = await TentativasAPI.status(tentativa.id);
      setResultado(st); // { entregue:true, acertos: X, total: Y, gabarito: {questaoId: "B", ...} }
    } catch (e) {
      setErr(e);
    }
  }

  if (loading) return <Loader/>;
  if (err) return <ErrorMsg error={err}/>;
  if (!simulado) return null;

  // array de questões (sua API pode retornar embed ou ids; adapte se vier como questaoIds e precisamos buscar)
  const questoes = simulado.questoes || simulado.questaoList || [];

  return (
      <div style={{ padding:20 }}>
        <h2>Simulado: {simulado.titulo}</h2>

        {!tentativa && !resultado && (
            <button onClick={iniciar}>Iniciar tentativa</button>
        )}

        {tentativa && !resultado && (
            <>
              <p><em>Tentativa #{tentativa.id}</em></p>
              <ol>
                {questoes.map((q, idx) => (
                    <li key={q.id} style={{ marginBottom:16 }}>
                      <div><strong>Q{idx+1}.</strong> {q.enunciado}</div>
                      <div style={{ display:"grid", gap:6, marginTop:6 }}>
                        {["A","B","C","D"].map((letra) => {
                          const texto = q[`alternativa${letra}`];
                          return (
                              <label key={letra} style={{ display:"flex", gap:8, cursor:"pointer" }}>
                                <input
                                    type="radio"
                                    name={`q${q.id}`}
                                    checked={respostas[q.id] === letra}
                                    onChange={() => selecionar(q.id, letra)}
                                />
                                <span>{letra}) {texto}</span>
                              </label>
                          );
                        })}
                      </div>
                    </li>
                ))}
              </ol>

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={salvarRespostas}>Salvar</button>
                <button onClick={entregar}>Entregar</button>
              </div>
            </>
        )}

        {resultado && (
            <>
              <h3>Resultado</h3>
              <p>Acertos: {resultado.acertos} / {resultado.total}</p>
              <h4>Gabarito</h4>
              <ol>
                {questoes.map((q, idx) => {
                  const correta = resultado.gabarito?.[q.id];
                  const marcada = resultado.marcadas?.[q.id];
                  const corretaTxt = q[`alternativa${correta}`];
                  const marcadaTxt = marcada ? q[`alternativa${marcada}`] : "-";
                  const acertou = correta === marcada;
                  return (
                      <li key={q.id} style={{ marginBottom:10 }}>
                        <div><strong>Q{idx+1}.</strong> {q.enunciado}</div>
                        <div>Sua resposta: {marcada ? `${marcada}) ${marcadaTxt}` : "—"}</div>
                        <div style={{ color: acertou ? "green" : "crimson" }}>
                          Gabarito: {correta}) {corretaTxt} {acertou ? "✓" : "✗"}
                        </div>
                      </li>
                  );
                })}
              </ol>
            </>
        )}
      </div>
  );
}
