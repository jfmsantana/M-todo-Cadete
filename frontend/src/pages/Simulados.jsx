import { useEffect, useState } from "react";
import { QuestoesAPI } from "../api/questoes";
import { SimuladosAPI } from "../api/simulados";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function Simulados() {
    const [titulo, setTitulo] = useState("");
    const [questoes, setQuestoes] = useState([]);
    const [selecionadas, setSelecionadas] = useState(new Set());
    const [listaSimulados, setListaSimulados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    async function carregar() {
        try {
            setLoading(true);
            setErr(null);
            const [q, s] = await Promise.all([
                QuestoesAPI.listar(),   // todas as questões
                SimuladosAPI.listar(),  // todos os simulados
            ]);
            setQuestoes(q);
            setListaSimulados(s);
        } catch (e) {
            setErr(e);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => { carregar(); }, []);

    function toggleQuestao(id) {
        setSelecionadas(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }

    async function criarSimulado(e) {
        e.preventDefault();
        if (!titulo.trim()) { alert("Informe um título."); return; }
        if (selecionadas.size === 0) { alert("Selecione pelo menos 1 questão."); return; }

        try {
            setErr(null);
            await SimuladosAPI.criar(titulo.trim(), Array.from(selecionadas));
            setTitulo("");
            setSelecionadas(new Set());
            await carregar();
            alert("Simulado criado!");
        } catch (e) {
            setErr(e);
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Simulados</h2>
            {loading ? <Loader/> : <ErrorMsg error={err}/>}

            <h3>Criar novo simulado</h3>
            <form onSubmit={criarSimulado} style={{ display:"grid", gap:8, maxWidth:700 }}>
                <input placeholder="Título do simulado"
                       value={titulo} onChange={e=>setTitulo(e.target.value)} />
                <div style={{ border:"1px solid #ddd", padding:12, borderRadius:8, maxHeight:300, overflow:"auto" }}>
                    {questoes.length === 0 ? <p>Nenhuma questão cadastrada.</p> : (
                        <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                            {questoes.map(q => (
                                <li key={q.id} style={{ marginBottom:10 }}>
                                    <label style={{ display:"flex", gap:8, cursor:"pointer" }}>
                                        <input
                                            type="checkbox"
                                            checked={selecionadas.has(q.id)}
                                            onChange={()=>toggleQuestao(q.id)}
                                        />
                                        <span><strong>#{q.id}</strong> [{q.materia}/{q.nivel}] {q.enunciado}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button type="submit">Salvar simulado</button>
            </form>

            <hr />
            <h3>Simulados existentes</h3>
            {listaSimulados.length === 0 ? <p>Nenhum simulado.</p> : (
                <ul>
                    {listaSimulados.map(s => (
                        <li key={s.id}>
                            <strong>{s.titulo}</strong> — {s.questaoIds?.length || s.questoes?.length || 0} questões
                            {" "}<a href={`/simulado/${s.id}`} style={{ marginLeft:8 }}>Abrir</a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
