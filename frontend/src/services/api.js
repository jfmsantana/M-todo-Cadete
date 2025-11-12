import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // ajusta se o backend usar outra porta
  headers: {
    "Content-Type": "application/json",
  },
});

// intercepta erros pra exibir mensagens amigáveis (opcional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("Erro API:", error.response?.data || error.message);
      return Promise.reject(error);
    }
);

export default api;
