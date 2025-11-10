import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    api.get("/usuarios")
      .then((res) => {
        console.log("Usuários recebidos:", res.data);
        setUsuarios(res.data);
      })
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Usuários</h1>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.email} — {u.perfil}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
