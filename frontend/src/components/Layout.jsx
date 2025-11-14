// src/components/Layout.jsx
import { NavLink, useNavigate } from "react-router-dom";
import "./Layout.css";

export default function Layout({ title, children }) {
    const navigate = useNavigate();

    let user = null;
    try {
        const raw = localStorage.getItem("usuarioLogado");
        user = raw ? JSON.parse(raw) : null;
    } catch (_) {
        user = null;
    }

    function handleLogout() {
        localStorage.removeItem("usuarioLogado");
        navigate("/auth");
    }

    return (
        <div className="app-shell">
            {/* TOPO */}
            <header className="app-header">
                <div className="app-header-left">
                    <span className="app-logo">Método Cadete</span>
                    {title && <span className="app-title">{title}</span>}
                </div>

                <div className="app-header-right">
                    {user && (
                        <>
                            <span className="app-user-email">{user.email}</span>
                            <span className="app-user-role">{user.perfil}</span>
                        </>
                    )}
                    <button className="app-logout" onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </header>

            {/* MENU */}
            <nav className="app-nav">
                <NavItem to="/home">Home</NavItem>
                <NavItem to="/usuarios">Usuários</NavItem>
                <NavItem to="/questoes">Questões</NavItem>
                <NavItem to="/simulados">Simulados</NavItem>
                <NavItem to="/redacoes">Redações</NavItem>
            </nav>

            {/* CONTEÚDO */}
            <main className="app-main">
                <div className="app-main-inner">{children}</div>
            </main>
        </div>
    );
}

function NavItem({ to, children }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                "app-nav-link" + (isActive ? " app-nav-link-active" : "")
            }
        >
            {children}
        </NavLink>
    );
}
