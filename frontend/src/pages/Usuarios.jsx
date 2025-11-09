import { useEffect, useState } from "react";
import api from "../services/api";

const PERFIS = ["ALUNO", "PROFESSOR", "ADMIN"];

export default function Usuarios() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState({
    email: "",
    senha: "",
    perfil: "ALUNO",
  });

  async function carregar() {
    try {
      setLoading(true);
      setErro(null);
      const res = await api.get("/usuarios");
      setLista(res.data);
    } catch (e) {
      setErro(e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      setErro(null);
      await api.post("/usuarios", form);
      setForm({ email: "", senha: "", perfil: "ALUNO" });
      await carregar();
    } catch (e) {
      setErro(e.response?.data || e.message);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h2>Usuários</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input
          type="email"
          required
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <input
          type="password"
          required
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => setForm(f => ({ ...f, senha: e.target.value }))}
        />
        <label>
          Perfil:
          <select
            value={form.perfil}
            onChange={(e) => setForm(f => ({ ...f, perfil: e.target.value }))}
          >
            {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <button type="submit">Cadastrar</button>
      </form>

      {erro && <p style={{ color: "crimson" }}>Erro: {String(erro)}</p>}
      {loading ? <p>Carregando...</p> : null}

      <hr />

      <h3>Lista</h3>
      {lista.length === 0 ? <p>Nenhum usuário.</p> :
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th><th>E-mail</th><th>Perfil</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.perfil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}
