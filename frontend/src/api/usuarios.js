import api from "../services/api";

export const UsuariosAPI = {
    listar: () => api.get("/usuarios").then(r => r.data),
    criar: (usuario) => api.post("/usuarios", usuario).then(r => r.data),
    buscar: (id) => api.get(`/usuarios/${id}`).then(r => r.data),
    // adiante poderemos adicionar atualizar/deletar
};
