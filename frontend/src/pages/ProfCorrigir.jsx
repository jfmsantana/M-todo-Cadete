// src/pages/ProfCorrigir.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RedacoesAPI } from "../api/redacoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function ProfCorrigir() {
    const { id } = useParams();
    const nav = useNavigate();
    const [r, setR] = useState(null);
    const [nota, setNota] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    // TODO: pegar do login depois; por hora, um professor existente
    const professorId = 4;

    useEffect(() => {
        (async () => {
            try {
                setLoading(true); setErr(null);
                const data = await RedacoesAPI.buscar(id);
                setR(data);
            } catch (e) { setErr(e); }
            finally { setLoading(false); }
        })();
    }, [id]);

    async function corrigir(e) {
        e.preventDefault();
        try {
            setErr(null);
            const n = nota === "" ? null : Number(nota);
            await RedacoesAPI.corrigir(r.id, professorId, n, feedback);
            alert("Redação corrigida!");
            nav("/prof/redacoes");
        } catch (e) { setErr(e); }
    }

    if (loading) return <Loader/>;
    if (err) return <ErrorMsg error={err}/>;
    if (!r) return <p>Redação não encontrada.</p>;

    return (
        <div style={{padding:20, maxWidth:900}}>
            <h2>Corrigir redação #{r.id} — {r.titulo}</h2>
            <p><b>Aluno:</b> {r.aluno?.email || r.alunoId}</p>
            <div style={{whiteSpace:"pre-wrap", border:"1px solid #555", padding:12, borderRadius:8, margin:"12px 0"}}>
                {r.texto}
            </div>

            <form onSubmit={corrigir} style={{display:"grid", gap:8, maxWidth:400}}>
                <label>
                    Nota:
                    <input type="number" step="0.1" min="0" max="10"
                           value={nota} onChange={e=>setNota(e.target.value)} />
                </label>
                <label>
                    Feedback:
                    <textarea rows={5} value={feedback} onChange={e=>setFeedback(e.target.value)} />
                </label>
                <button type="submit">Salvar correção</button>
            </form>
        </div>
    );
}
