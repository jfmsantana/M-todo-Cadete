// src/pages/Usuarios.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Usuarios.css"; // se quiser estilizar mais depois

function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem("usuarioLogado");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Usuarios() {
  const [user, setUser] = useState(null);
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [form, setForm] = useState({
    email: "",
    perfil: "ALUNO",
  });

  useEffect(() => {
    const u = getUsuarioLogado();
    if (u) setUser(u);
  }, []);

  const isAdmin = user?.perfil === "ADMIN";
  const isProfessor = user?.perfil === "PROFESSOR";
  const temAcesso = isAdmin || isProfessor;

  async function carregar() {
    if (!user) return;
    try {
      setLoading(true);
      setErr(null);

      const resp = await fetch("http://localhost:8080/api/usuarios", {
        headers: {
          "x-user-id": user.id,
        },
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erro ao listar usuários.");
      }

      const data = await resp.json();
      setLista(data);
    } catch (e) {
      setErr(e.message || "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (temAcesso) {
      carregar();
    }
  }, [user?.id, user?.perfil]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCadastrar(e) {
    e.preventDefault();
    if (!isAdmin) {
      alert("Apenas administradores podem cadastrar usuários.");
      return;
    }
    if (!form.email.trim()) {
      alert("Informe um e-mail.");
      return;
    }

    try {
      setErr(null);
      const resp = await fetch("http://localhost:8080/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          email: form.email.trim(),
          perfil: form.perfil,
          // senha pode vir vazia, o backend aplica "metodocadete"
          senha: "",
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erro ao cadastrar usuário.");
      }

      setForm({ email: "", perfil: "ALUNO" });
      await carregar();
      alert('Usuário cadastrado com senha inicial "metodocadete".');
    } catch (e) {
      setErr(e.message || "Erro ao cadastrar usuário.");
    }
  }

  async function handleEditar(u) {
    const novoEmail = window.prompt("Novo e-mail:", u.email);
    if (!novoEmail) return;

    const novoPerfil = window.prompt(
        'Novo perfil (ALUNO, PROFESSOR, ADMIN):',
        u.perfil
    );
    if (!novoPerfil) return;

    try {
      const resp = await fetch(
          `http://localhost:8080/api/usuarios/${u.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user.id,
            },
            body: JSON.stringify({
              email: novoEmail.trim(),
              perfil: novoPerfil.trim().toUpperCase(),
              senha: u.senha, // não alteramos senha aqui
            }),
          }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erro ao atualizar usuário.");
      }

      await carregar();
      alert("Usuário atualizado.");
    } catch (e) {
      setErr(e.message || "Erro ao atualizar usuário.");
    }
  }

  async function handleExcluir(id) {
    if (!isAdmin) {
      alert("Apenas administradores podem excluir usuários.");
      return;
    }
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const resp = await fetch(
          `http://localhost:8080/api/usuarios/${id}`,
          {
            method: "DELETE",
            headers: {
              "x-user-id": user.id,
            },
          }
      );

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erro ao excluir usuário.");
      }

      setLista((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setErr(e.message || "Erro ao excluir usuário.");
    }
  }

  // ---------- RENDER ----------

  if (!user) {
    return (
        <Layout title="Usuários">
          <p>Faça login para acessar a gestão de usuários.</p>
        </Layout>
    );
  }

  if (!temAcesso) {
    return (
        <Layout title="Usuários">
          <p>Apenas professores e administradores têm acesso a esta página.</p>
        </Layout>
    );
  }

  return (
      <Layout title="Usuários">
        <div className="usuarios-page">
          <div className="card usuarios-card">
            <div className="usuarios-header">
              <h2>Gestão de usuários</h2>
              <p>
                Professores podem <strong>listar e atualizar</strong>.{" "}
                Administradores podem{" "}
                <strong>cadastrar e excluir</strong> também.
              </p>
            </div>

            {isAdmin && (
                <form className="usuarios-form" onSubmit={handleCadastrar}>
                  <h3>Cadastrar novo usuário</h3>
                  <div className="usuarios-form-grid">
                    <div className="form-group">
                      <label>E-mail</label>
                      <input
                          className="input"
                          type="email"
                          name="email"
                          placeholder="aluno@exemplo.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                      />
                    </div>
                    <div className="form-group">
                      <label>Perfil</label>
                      <select
                          className="input"
                          name="perfil"
                          value={form.perfil}
                          onChange={handleChange}
                      >
                        <option value="ALUNO">ALUNO</option>
                        <option value="PROFESSOR">PROFESSOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                  </div>
                  <p className="usuarios-info-senha">
                    A senha inicial será <code>metodocadete</code>.
                    Depois podemos implementar “Esqueci minha senha”.
                  </p>
                  <button type="submit" className="btn-primary">
                    Cadastrar usuário
                  </button>
                </form>
            )}

            {loading && <p>Carregando usuários...</p>}
            {err && (
                <p style={{ color: "crimson", marginTop: 8 }}>
                  {err}
                </p>
            )}

            <div className="usuarios-list-container">
              <h3>Lista de usuários</h3>
              {lista.length === 0 ? (
                  <p>Nenhum usuário cadastrado.</p>
              ) : (
                  <table className="usuarios-table">
                    <thead>
                    <tr>
                      <th>ID</th>
                      <th>E-mail</th>
                      <th>Perfil</th>
                      <th style={{ width: 140 }}>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lista.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.email}</td>
                          <td>{u.perfil}</td>
                          <td>
                            <button
                                type="button"
                                onClick={() => handleEditar(u)}
                                className="btn-table"
                            >
                              Editar
                            </button>
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={() => handleExcluir(u.id)}
                                    className="btn-table btn-danger"
                                >
                                  Excluir
                                </button>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </div>
          </div>
        </div>
      </Layout>
  );
}
