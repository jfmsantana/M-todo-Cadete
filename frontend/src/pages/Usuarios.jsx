// src/pages/Usuarios.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ErrorMsg from "../components/ErrorMsg";
// ajuste o caminho/nome conforme seu projeto
import { UsuariosAPI } from "../api/usuarios";

const PERFIS = ["ALUNO", "PROFESSOR", "ADMIN"];

export default function Usuarios() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("ALUNO");

  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function carregar() {
    try {
      setLoading(true);
      setErr(null);
      const data = await UsuariosAPI.listar(); // GET /api/usuarios
      setLista(data);
    } catch (e) {
      setErr(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(e) {
    e.preventDefault();
    try {
      setErr(null);
      await UsuariosAPI.criar({
        email: email.trim(),
        senha: senha.trim(),
        perfil,
      });
      setEmail("");
      setSenha("");
      setPerfil("ALUNO");
      await carregar();
      alert("Usuário cadastrado com sucesso!");
    } catch (e) {
      setErr(e.response?.data || e.message);
    }
  }

  return (
      <Layout title="Usuários">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* bloco form */}
          <div className="card">
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>Cadastro de usuários</h2>

            {err && (
                <div style={{ marginBottom: 8 }}>
                  <ErrorMsg error={err} />
                </div>
            )}

            <form
                onSubmit={criar}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr auto",
                  gap: 8,
                  alignItems: "center",
                }}
            >
              <input
                  className="input"
                  placeholder="E-mail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <input
                  className="input"
                  placeholder="Senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
              />
              <select
                  className="input"
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value)}
              >
                {PERFIS.map((p) => (
                    <option key={p}>{p}</option>
                ))}
              </select>
              <button type="submit">Cadastrar</button>
            </form>
          </div>

          {/* bloco lista */}
          <div className="card">
            <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
            >
              <h3 style={{ margin: 0 }}>Lista de usuários</h3>
              <button type="button" onClick={carregar}>
                Atualizar
              </button>
            </div>

            {loading ? (
                <Loader />
            ) : lista.length === 0 ? (
                <p>Nenhum usuário cadastrado.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.9rem",
                      }}
                  >
                    <thead>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>E-mail</th>
                      <th style={thStyle}>Perfil</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lista.map((u) => (
                        <tr key={u.id}>
                          <td style={tdStyle}>{u.id}</td>
                          <td style={tdStyle}>{u.email}</td>
                          <td style={tdStyle}>{u.perfil}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        </div>
      </Layout>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "6px 8px",
  borderBottom: "1px solid #e5e7eb",
  background: "#f9fafb",
};

const tdStyle = {
  padding: "6px 8px",
  borderBottom: "1px solid #f3f4f6",
};
