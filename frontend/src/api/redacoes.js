// src/api/redacoes.js
import api from "../services/api";

export const RedacoesAPI = {
    doAluno: (alunoId) => api.get(`/redacoes/aluno/${alunoId}`).then(r => r.data),
    pendentes: () => api.get(`/redacoes/pendentes`).then(r => r.data),
    buscar: (id) => api.get(`/redacoes/${id}`).then(r => r.data),
    criar: (alunoId, titulo, texto) => api.post(`/redacoes`, { alunoId, titulo, texto }).then(r => r.data),
    corrigir: (id, professorId, nota, feedback) =>
        api.post(`/redacoes/${id}/corrigir`, { professorId, nota, feedback }).then(r => r.data),
};
