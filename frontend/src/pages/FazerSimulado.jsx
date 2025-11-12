// src/pages/FazerSimulado.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SimuladosAPI, TentativasAPI } from "../api/simulados";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function FazerSimulado() {
    const { id } = useParams(); // ID do simulado
    const [simulado, setSimulado] = useState(null);
    const [tentativa, setTentativa] = useState(null);
    const [respostas, setRespostas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    // TEMP: aluno logado (até termos login real)
    const alunoId = 3; // ajuste aqui se precisar

    useEffect(() => {
        async function carregar() {
            try {
                setLoading(true);
                setErr(null);
                const s = await SimuladosAPI.buscar(id);
                setSimulado(s);
            } catch (e) {
                setErr(e.response?.data || e.message);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    async function iniciarSimulado() {
        try {
            setErr(null);
            const t = await TentativasAPI.iniciar(simulado.id, alunoId);
            setTentativa(t);
        } catch (e) {
            setErr(e.response?.data || e.message);
        }
    }

    function marcarResposta(questaoId, letra) {
        setRespostas(r => ({ ...r, [questaoId]: letra }));
    }

    async function entregar() {
        try {
            setErr(null);

            // garante uma tentativa
            let tid = tentativa?.id;
            if (!tid) {
                const t = await TentativasAPI.iniciar(simulado.id, alunoId);
                setTentativa(t);
                tid = t.id;
            }

            // payload certo: { respostas: [ { questaoId, marcada } ] }
            const payload = Object.entries(respostas).map(([questaoId, letra]) => ({
                questaoId: Number(questaoId),
                marcada: letra,
            }));

            // envia respostas (não entrega ainda)
            await TentativasAPI.responder(tid, payload);

            // agora entrega
            const resultadoFinal = await TentativasAPI.entregar(tid);
            setResultado(resultadoFinal);
        } catch (e) {
            setErr(e);
        }
    }

    if (loading) return <Loader />;
    if (err) return <ErrorMsg error={err} />;
    if (!simulado) return <p>Simulado não encontrado.</p>;

    // Após a entrega: mostrar nota e gabarito
    if (resultado) {
        const nota = `${resultado.acertos}/${resultado.total}`;
        return (
            <div style={{ padding: 20 }}>
                <h2>Resultado — {simulado.titulo}</h2>
                <p><strong>Nota:</strong> {nota}</p>

                <h3>Gabarito</h3>
                <ul>
                    {resultado.gabarito?.map((g) => (
                        <li key={g.questaoId}>
                            #{g.questaoId} — sua: {g.marcada || "-"} | correta:{" "}
                            <span style={{ color: g.acertou ? "green" : "crimson" }}>
                {g.correta}
              </span>
                            {g.acertou ? " ✅" : " ❌"}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    // Antes de iniciar
    if (!tentativa) {
        return (
            <div style={{ padding: 20 }}>
                <h2>{simulado.titulo}</h2>
                <p>{simulado.questoes?.length || 0} questões.</p>
                <button onClick={iniciarSimulado}>Iniciar simulado</button>
            </div>
        );
    }

    // Durante o simulado
    return (
        <div style={{ padding: 20 }}>
            <h2>Respondendo: {simulado.titulo}</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    entregar();
                }}
            >
                <ol>
                    {simulado.questoes?.map((q) => (
                        <li key={q.id} style={{ marginBottom: 16 }}>
                            <p><strong>{q.enunciado}</strong></p>
                            {["A", "B", "C", "D"].map((letra) => (
                                <label key={letra} style={{ display: "block" }}>
                                    <input
                                        type="radio"
                                        name={`q${q.id}`}
                                        value={letra}
                                        checked={respostas[q.id] === letra}
                                        onChange={() => marcarResposta(q.id, letra)}
                                    />{" "}
                                    {letra}) {q[`alternativa${letra}`]}
                                </label>
                            ))}
                        </li>
                    ))}
                </ol>

                <button type="submit">Entregar simulado</button>
            </form>
        </div>
    );
}
