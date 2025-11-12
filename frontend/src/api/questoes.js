import api from "../services/api";

export const QuestoesAPI = {
    listar: (materia, nivel) =>
        api.get("/questoes", { params: { materia, nivel } }).then(r => r.data),
    criar: (payload) => api.post("/questoes", payload).then(r => r.data),
    buscar: (id) => api.get(`/questoes/${id}`).then(r => r.data),
    atualizar: (id, payload) => api.put(`/questoes/${id}`, payload).then(r => r.data),
    deletar: (id) => api.delete(`/questoes/${id}`).then(r => r.data),
};
