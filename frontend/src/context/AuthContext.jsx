import { createContext, useContext, useState } from "react";

// DEV: defina aqui o usuário "logado" (troque conforme for testando)
const initialUser = { id: 3, perfil: "ALUNO", email: "aluno@cadete.com" };
// Ex.: professor -> { id: 2, perfil: "PROFESSOR", email: "prof@cadete.com" }
// Ex.: admin     -> { id: 1, perfil: "ADMIN", email: "admin@cadete.com" }

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(initialUser);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {/* Dev Switcher (opcional) */}
            <div style={{ padding: 8, background: "#f7f7f7", borderBottom: "1px solid #eee" }}>
                <strong>Usuário atual:</strong> {user.email} — {user.perfil}{" "}
                <select
                    value={user.perfil}
                    onChange={(e) => setUser((u) => ({ ...u, perfil: e.target.value }))}
                    style={{ marginLeft: 8 }}
                >
                    <option>ALUNO</option>
                    <option>PROFESSOR</option>
                    <option>ADMIN</option>
                </select>
                <input
                    style={{ marginLeft: 8, width: 80 }}
                    type="number"
                    min={1}
                    value={user.id}
                    onChange={(e) => setUser((u) => ({ ...u, id: Number(e.target.value) }))}
                    title="user id"
                />
            </div>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
