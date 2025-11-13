import api from "../services/api";

export const RedacoesAPI = {
    // ALUNO cria redação
    criar: (alunoId, titulo, texto) =>
        api.post("/redacoes", { alunoId, titulo, texto }).then(r => r.data),

    // Listar TODAS (admin/prof) ou filtrar do aluno
    todas: () => api.get("/redacoes").then(r => r.data),
    doAluno: (alunoId) => api.get(`/redacoes/aluno/${alunoId}`).then(r => r.data),

    // Pendentes para correção (prof/admin pode filtrar client-side por status)
    pendentes: async () => {
        const todas = await api.get("/redacoes").then(r => r.data);
        return todas.filter(r => r.status === "PENDENTE");
    },

    // Corrigir (prof/admin)
    corrigir: (redacaoId, professorId, nota, feedback) =>
        api.post(`/redacoes/${redacaoId}/corrigir`, { professorId, nota, feedback })
            .then(r => r.data),
};
