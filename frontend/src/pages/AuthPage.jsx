// src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage() {
    const [mode, setMode] = useState("login"); // "login" ou "register"
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (mode === "register" && form.password !== form.confirmPassword) {
            alert("As senhas não conferem.");
            return;
        }

        try {
            console.log("🔹 Enviando auth...", mode, form);

            if (mode === "login") {
                const response = await fetch("http://localhost:8080/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        senha: form.password,
                    }),
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error("❌ Erro login backend:", response.status, text);
                    if (response.status === 401) {
                        throw new Error("E-mail ou senha inválidos.");
                    }
                    throw new Error("Erro ao fazer login.");
                }

                const data = await response.json();
                console.log("✅ Login OK:", data);
                localStorage.setItem("usuarioLogado", JSON.stringify(data));
                navigate("/home");
            } else {
                // Cadastro -> cria usuário no backend, perfil padrão ALUNO
                const response = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        senha: form.password,
                        perfil: "ALUNO", // cadastro pela tela vira aluno
                    }),
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error("❌ Erro cadastro backend:", response.status, text);
                    throw new Error("Erro ao cadastrar usuário.");
                }

                const data = await response.json();
                console.log("✅ Cadastro OK:", data);
                alert("Cadastro realizado com sucesso! Agora faça login.");
                setMode("login");
            }
        } catch (err) {
            console.error("🔥 Erro auth (catch):", err);
            alert(err.message || "Algo deu errado. Tente novamente.");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-logo">Método Cadete</div>
                <h1>Domine redações com consistência.</h1>
                <p>
                    Plataforma para alunos, professores e corretores organizarem redações,
                    correções e evolução ao longo do tempo.
                </p>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-tabs">
                        <button
                            className={mode === "login" ? "active" : ""}
                            onClick={() => setMode("login")}
                            type="button"
                        >
                            Login
                        </button>
                        <button
                            className={mode === "register" ? "active" : ""}
                            onClick={() => setMode("register")}
                            type="button"
                        >
                            Cadastro
                        </button>
                    </div>

                    <h2>{mode === "login" ? "Bem-vindo de volta" : "Criar nova conta"}</h2>
                    <p className="auth-subtitle">
                        {mode === "login"
                            ? "Entre para acessar suas redações."
                            : "Leva menos de 1 minuto."}
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {mode === "register" && (
                            <div className="form-group">
                                <label htmlFor="name">Nome completo</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Seu nome"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="voce@exemplo.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {mode === "register" && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar senha</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Repita a senha"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        {mode === "login" && (
                            <div className="auth-extra">
                                <label className="checkbox">
                                    <input type="checkbox" /> Manter conectado
                                </label>
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => alert("Funcionalidade em breve")}
                                >
                                    Esqueci minha senha
                                </button>
                            </div>
                        )}

                        <button className="auth-submit" type="submit">
                            {mode === "login" ? "Entrar" : "Criar conta"}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        {mode === "login" ? (
                            <>
                                Ainda não tem conta?{" "}
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => setMode("register")}
                                >
                                    Cadastre-se
                                </button>
                            </>
                        ) : (
                            <>
                                Já tem conta?{" "}
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => setMode("login")}
                                >
                                    Faça login
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
