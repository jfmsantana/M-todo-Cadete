// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Carrega do localStorage ao iniciar
    useEffect(() => {
        try {
            const raw = localStorage.getItem("usuarioLogado");
            if (raw) {
                setUser(JSON.parse(raw));
            }
        } catch {
            // se der erro, ignora e mantém user = null
        }
    }, []);

    function login(dadosUsuario) {
        setUser(dadosUsuario);
        localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
    }

    function logout() {
        setUser(null);
        localStorage.removeItem("usuarioLogado");
    }

    const value = { user, setUser, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
