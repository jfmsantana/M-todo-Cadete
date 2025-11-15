// src/api/simulados.js

const BASE_URL = "http://localhost:8080/api";

export const SimuladosAPI = {
    async buscarPorId(id) {
        const resp = await fetch(`${BASE_URL}/simulados/${id}`);
        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao buscar simulado:", resp.status, text);
            throw new Error("Erro ao buscar simulado");
        }
        return resp.json();
    },
};

export const TentativasAPI = {
    async iniciar(simuladoId, alunoId) {
        const resp = await fetch(
            `${BASE_URL}/simulados/${simuladoId}/iniciar`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ alunoId }),
            }
        );

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao iniciar tentativa:", resp.status, text);
            throw new Error("Erro ao iniciar tentativa");
        }

        return resp.json(); // retorna a Tentativa
    },

    async responder(tentativaId, itens) {
        const resp = await fetch(
            `${BASE_URL}/tentativas/${tentativaId}/responder`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itens }),
            }
        );

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao enviar respostas:", resp.status, text);
            throw new Error("Erro ao enviar respostas");
        }

        return resp.json(); // retorna a Tentativa atualizada
    },

    async entregar(tentativaId) {
        const resp = await fetch(
            `${BASE_URL}/tentativas/${tentativaId}/entregar`,
            {
                method: "POST",
            }
        );

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao entregar simulado:", resp.status, text);
            throw new Error("Erro ao entregar simulado");
        }

        return resp.json(); // TentativaDTOs.Resultado
    },
};
