import { apiFetch } from "./client";

export const UsuariosAPI = {
    listar: () => apiFetch("/api/usuarios"),
    criar: (usuario) =>
        apiFetch("/api/usuarios", { method: "POST", body: JSON.stringify(usuario) }),
};
