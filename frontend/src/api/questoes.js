// src/api/questoes.js

const BASE_URL = "http://localhost:8080/api/questoes";

export const QuestoesAPI = {
    async listar(materia, nivel) {
        const params = new URLSearchParams();

        if (materia) {
            params.append("materia", materia);
        }
        if (nivel) {
            params.append("nivel", nivel);
        }

        const url =
            params.toString().length > 0
                ? `${BASE_URL}?${params.toString()}`
                : BASE_URL;

        const resp = await fetch(url);

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao listar questões:", resp.status, text);
            throw new Error("Erro ao listar questões");
        }

        return resp.json();
    },

    // AGORA RECEBE userId PARA ENVIAR NO HEADER
    async criar(payload, userId) {
        const headers = {
            "Content-Type": "application/json",
        };

        if (userId) {
            headers["x-user-id"] = userId;
        }

        const resp = await fetch(BASE_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao criar questão:", resp.status, text);
            throw new Error("Erro ao criar questão");
        }

        return resp.json();
    },
};
