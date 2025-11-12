// src/pages/ProfRedacoes.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RedacoesAPI } from "../api/redacoes";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function ProfRedacoes() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    async function carregar() {
        try {
            setLoading(true); setErr(null);
            const data = await RedacoesAPI.pendentes();
            setLista(data);
        } catch (e) { setErr(e); }
        finally { setLoading(false); }
    }

    useEffect(()=>{ carregar(); }, []);

    return (
        <div style={{padding:20}}>
            <h2>Redações pendentes</h2>
            {loading ? <Loader/> : <ErrorMsg error={err}/>}
            {lista.length === 0 ? <p>Nenhuma redação pendente.</p> : (
                <table border="1" cellPadding="6">
                    <thead>
                    <tr><th>ID</th><th>Aluno</th><th>Título</th><th>Criada em</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                    {lista.map(r=>(
                        <tr key={r.id}>
                            <td>{r.id}</td>
                            <td>{r.aluno?.email || r.alunoId}</td>
                            <td>{r.titulo}</td>
                            <td>{r.criacao?.replace('T',' ').slice(0,19)}</td>
                            <td><Link to={`/prof/redacoes/${r.id}`}>Corrigir</Link></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
