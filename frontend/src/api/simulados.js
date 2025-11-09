import { apiFetch } from "./client";

export const SimuladosAPI = {
    criar: (titulo, questaoIds) =>
        apiFetch("/api/simulados", { method: "POST", body: JSON.stringify({ titulo, questaoIds }) }),
    listar: () => apiFetch("/api/simulados"),
    buscar: (id) => apiFetch(`/api/simulados/${id}`),
};

export const TentativasAPI = {
    iniciar: (simuladoId, alunoId) =>
        apiFetch(`/api/tentativas/simulado/${simuladoId}/iniciar`, {
            method: "POST",
            body: JSON.stringify({ alunoId }),
        }),
    responder: (tentativaId, respostas) =>
        apiFetch(`/api/tentativas/${tentativaId}/responder`, {
            method: "POST",
            body: JSON.stringify({ respostas }),
        }),
    status: (tentativaId) => apiFetch(`/api/tentativas/${tentativaId}/status`),
    entregar: (tentativaId) => apiFetch(`/api/tentativas/${tentativaId}/entregar`, { method: "POST" }),
};
