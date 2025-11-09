import { apiFetch } from "./client";

export const QuestoesAPI = {
    listar: (materia, nivel) => {
        const params = new URLSearchParams();
        if (materia) params.set("materia", materia);
        if (nivel) params.set("nivel", nivel);
        const qs = params.toString();
        return apiFetch(`/api/questoes${qs ? "?" + qs : ""}`);
    },
    criar: (q) => apiFetch("/api/questoes", { method: "POST", body: JSON.stringify(q) }),
};
