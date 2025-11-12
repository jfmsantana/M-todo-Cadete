import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SimuladosAPI, TentativasAPI } from "../api/simulados";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";

export default function SimuladoDetalhe() {
    const { id } = useParams();
    const [simulado, setSimulado] = useState(null);
    const [tentativa, setTentativa] = useState(null);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔹 Carrega os dados do simulado
    useEffect(() => {
        async function carregar() {
            try {
                setLoading(true);
                const data = await SimuladosAPI.buscar(id);
                setSimulado(data);
            } catch (e) {
                setErr(e);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    // 🔹 Iniciar tentativa (aqui que dá o erro se o alunoId for inválido)
    async function iniciarTentativa() {
        try {
            setErr(null);
            // ⚠️ ALTERE O ID AQUI para um aluno existente, ex: 3
            const tentativa = await TentativasAPI.iniciar(id, 3);
            setTentativa(tentativa);
            alert("Tentativa iniciada com sucesso!");
        } catch (e) {
            setErr(e);
            console.error("Erro ao iniciar tentativa:", e);
        }
    }

    if (loading) return <Loader />;
    if (err) return <ErrorMsg error={err} />;
    if (!simulado) return <p>Simulado não encontrado.</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>{simulado.titulo}</h2>

            {/* 🔹 Lista das questões */}
            <ul>
                {(simulado.questoes || []).map((q) => (
                    <li key={q.id}>
                        <strong>{q.enunciado}</strong><br />
                        A) {q.alternativaA}<br />
                        B) {q.alternativaB}<br />
                        C) {q.alternativaC}<br />
                        D) {q.alternativaD}
                    </li>
                ))}
            </ul>

            {/* 🔹 Botão para iniciar tentativa */}
            <button onClick={iniciarTentativa} style={{ marginTop: 20 }}>
                Iniciar tentativa
            </button>

            {tentativa && (
                <div style={{ marginTop: 20 }}>
                    <h3>Tentativa iniciada!</h3>
                    <p>ID da tentativa: {tentativa.id}</p>
                    <p>Status: {tentativa.status}</p>
                </div>
            )}
        </div>
    );
}
