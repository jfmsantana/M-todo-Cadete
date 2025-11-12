import api from "../services/api";

export const SimuladosAPI = {
    criar: (titulo, questaoIds) =>
        api.post("/simulados", { titulo, questaoIds }).then((r) => r.data),
    listar: () => api.get("/simulados").then((r) => r.data),
    buscar: (id) => api.get(`/simulados/${id}`).then((r) => r.data),
};

export const TentativasAPI = {
    iniciar: (simuladoId, alunoId) =>
        api
            .post(`/tentativas/simulado/${simuladoId}/iniciar`, { alunoId })
            .then((r) => r.data),
    responder: (tentativaId, respostas) =>
        api
            .post(`/tentativas/${tentativaId}/responder`, { respostas })
            .then((r) => r.data),
    status: (tentativaId) =>
        api.get(`/tentativas/${tentativaId}/status`).then((r) => r.data),
    entregar: (tentativaId) =>
        api.post(`/tentativas/${tentativaId}/entregar`).then((r) => r.data),
};
