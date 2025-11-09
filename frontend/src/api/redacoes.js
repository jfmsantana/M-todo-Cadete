import { apiFetch } from "./client";

export const RedacoesAPI = {
    criar: (alunoId, titulo, texto) =>
        apiFetch("/api/redacoes", { method: "POST", body: JSON.stringify({ alunoId, titulo, texto }) }),
    listar: () => apiFetch("/api/redacoes"),
    doAluno: (alunoId) => apiFetch(`/api/redacoes/aluno/${alunoId}`),
    corrigir: (id, professorId, nota, feedback) =>
        apiFetch(`/api/redacoes/${id}/corrigir`, {
            method: "POST",
            body: JSON.stringify({ professorId, nota, feedback }),
        }),
};
