// src/api/questoes.js
const BASE_URL = "http://localhost:8080/api/questoes";

function getUsuarioLogado() {
    try {
        const raw = localStorage.getItem("usuarioLogado");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export const QuestoesAPI = {
    async listar(materia, nivel) {
        const params = new URLSearchParams();
        if (materia) params.append("materia", materia);
        if (nivel) params.append("nivel", nivel);

        const resp = await fetch(
            `${BASE_URL}${params.toString() ? "?" + params.toString() : ""}`
        );
        if (!resp.ok) throw new Error("Erro ao listar questões");
        return resp.json();
    },

    async criar(dados) {
        const user = getUsuarioLogado();
        if (!user) throw new Error("Usuário não logado");

        const resp = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": user.id,
            },
            body: JSON.stringify(dados),
        });

        if (!resp.ok) {
            const text = await resp.text();
            console.error("Erro ao criar questão:", resp.status, text);
            throw new Error("Erro ao criar questão");
        }
        return resp.json();
    },

    async atualizar(id, dados) {
        const user = getUsuarioLogado();
        if (!user) throw new Error("Usuário não logado");

        const resp = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-user-id": user.id,
            },
            body: JSON.stringify(dados),
        });

        if (!resp.ok) throw new Error("Erro ao atualizar questão");
        return resp.json();
    },

    async deletar(id) {
        const user = getUsuarioLogado();
        if (!user) throw new Error("Usuário não logado");

        const resp = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "x-user-id": user.id,
            },
        });

        if (!resp.ok) throw new Error("Erro ao deletar questão");
    },
};
