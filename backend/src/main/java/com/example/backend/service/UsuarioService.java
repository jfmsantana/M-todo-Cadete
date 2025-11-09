package com.example.backend.service;

import com.example.backend.model.Usuario;
import com.example.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository repo;

    public Usuario buscarPorId(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + id));
    }

    public Usuario atualizar(Long id, Usuario dados) {
        Usuario u = buscarPorId(id);
        if (dados.getEmail() == null || dados.getEmail().isBlank()){
            throw new IllegalArgumentException("E-mail é obrigatório");
        }
        u.setEmail(dados.getEmail());
        if (dados.getSenha() != null) u.setSenha(dados.getSenha());
        if (dados.getPerfil() != null) u.setPerfil(dados.getPerfil());
        return repo.save(u);
    }
    public void deletar(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Usuário não encontrado: " + id);
        }
        repo.deleteById(id);
    }
    public Usuario criar(Usuario u) {
        if ((u.getEmail() == null) || u.getEmail().isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório");
        }
        return repo.save(u);
    }
    public List<Usuario> listar() {
        return repo.findAll();
    }
}

