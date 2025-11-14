package com.example.backend.web;

import com.example.backend.model.Usuario;
import com.example.backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // --------- helpers de permissão ---------
    private void exigirProfessorOuAdmin(Usuario u) {
        if (u.getPerfil() != Usuario.Perfil.ADMIN &&
                u.getPerfil() != Usuario.Perfil.PROFESSOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas professores ou administradores podem acessar esta funcionalidade.");
        }
    }

    private void exigirAdmin(Usuario u) {
        if (u.getPerfil() != Usuario.Perfil.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas administradores podem acessar esta funcionalidade.");
        }
    }

    private Usuario usuarioRequisitante(Long reqUserId) {
        if (reqUserId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Cabeçalho x-user-id é obrigatório.");
        }
        return usuarioService.buscarPorId(reqUserId);
    }

    // --------- ENDPOINTS ---------

    @GetMapping
    public List<Usuario> listar(@RequestHeader("x-user-id") Long reqUserId) {
        Usuario req = usuarioRequisitante(reqUserId);
        exigirProfessorOuAdmin(req);
        return usuarioService.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Usuario criar(@RequestHeader("x-user-id") Long reqUserId,
                         @RequestBody Usuario novo) {
        Usuario req = usuarioRequisitante(reqUserId);
        exigirAdmin(req);

        // senha genérica se não enviada
        if (novo.getSenha() == null || novo.getSenha().isBlank()) {
            novo.setSenha("metodocadete");
        }
        return usuarioService.criar(novo);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(@RequestHeader("x-user-id") Long reqUserId,
                             @PathVariable Long id,
                             @RequestBody Usuario dados) {
        Usuario req = usuarioRequisitante(reqUserId);
        // professor OU admin podem atualizar
        exigirProfessorOuAdmin(req);
        return usuarioService.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@RequestHeader("x-user-id") Long reqUserId,
                        @PathVariable Long id) {
        Usuario req = usuarioRequisitante(reqUserId);
        // apenas admin
        exigirAdmin(req);
        usuarioService.deletar(id);
    }
}
