import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Layout from "./components/Layout";

import Usuarios from "./pages/Usuarios";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import Redacoes from "./pages/Redacoes";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />

                <Route
                    path="/home"
                    element={
                        <Layout>
                            <Home />
                        </Layout>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <Layout>
                            <Usuarios />
                        </Layout>
                    }
                />
                <Route
                    path="/questoes"
                    element={
                        <Layout>
                            <Questoes />
                        </Layout>
                    }
                />
                <Route
                    path="/simulados"
                    element={
                        <Layout>
                            <Simulados />
                        </Layout>
                    }
                />
                <Route
                    path="/redacoes"
                    element={
                        <Layout>
                            <Redacoes />
                        </Layout>
                    }
                />

                <Route path="*" element={<AuthPage />} />
            </Routes>
        </BrowserRouter>
    );
}
