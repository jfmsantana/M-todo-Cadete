import { useEffect, useState } from "react";
import api from "./services/api";
import Usuarios from "./pages/Usuarios";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display:"flex", gap:12, padding:12 }}>
        <Link to="/">Home</Link>
        <Link to="/usuarios">Usuários</Link>
        {/* suas outras páginas */}
      </nav>
      <Routes>
        {/* outras rotas */}
        <Route path="/usuarios" element={<Usuarios />} />
      </Routes>
    </BrowserRouter>
  );
}