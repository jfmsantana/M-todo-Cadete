// src/api/questoes.js

const BASE_URL = "http://localhost:8080/api/questoes";

export const QuestoesAPI = {
    async listar(materia, nivel) {
        const params = new URLSearchParams();

        // só manda se tiver valor
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

    async criar(payload) {
        const resp = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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
