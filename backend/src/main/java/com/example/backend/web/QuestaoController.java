// src/main/java/com/example/backend/web/QuestaoController.java
package com.example.backend.web;

import com.example.backend.model.Questao;
import com.example.backend.model.Usuario;
import com.example.backend.service.QuestaoService;
import com.example.backend.service.QuestaoRespostaService;
import com.example.backend.service.UsuarioService;
import com.example.backend.web.dto.QuestaoRespostaDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questoes")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class QuestaoController {

    private final QuestaoService questaoService;
    private final QuestaoRespostaService questaoRespostaService;
    private final UsuarioService usuarioService;

    // ------------ UTILITÁRIO DE PERMISSÃO ------------
    private void validarGestor(Long userId) {
        Usuario u = usuarioService.buscarPorId(userId);
        if (u.getPerfil() != Usuario.Perfil.ADMIN &&
                u.getPerfil() != Usuario.Perfil.PROFESSOR) {

            throw new RuntimeException("Acesso negado: apenas ADMIN ou PROFESSOR podem gerenciar questões.");
        }
    }

    // ------------ LISTAR QUESTÕES (ALUNO/PROF/ADMIN) ------------
    @GetMapping
    public List<Questao> listar(
            @RequestParam(required = false) String materia,
            @RequestParam(required = false) String nivel
    ) {
        return questaoService.listar(materia, nivel);
    }

    // ------------ CRIAR QUESTÃO (SOMENTE PROFESSOR/ADMIN) ------------
    @PostMapping
    public Questao criar(
            @RequestHeader("x-user-id") Long userId,
            @RequestBody Questao q
    ) {
        validarGestor(userId);
        return questaoService.criar(q);
    }

    // ------------ ATUALIZAR QUESTÃO (SOMENTE PROFESSOR/ADMIN) ------------
    @PutMapping("/{id}")
    public Questao atualizar(
            @RequestHeader("x-user-id") Long userId,
            @PathVariable Long id,
            @RequestBody Questao dados
    ) {
        validarGestor(userId);
        return questaoService.atualizar(id, dados);
    }

    // ------------ DELETAR QUESTÃO (SOMENTE PROFESSOR/ADMIN) ------------
    @DeleteMapping("/{id}")
    public void deletar(
            @RequestHeader("x-user-id") Long userId,
            @PathVariable Long id
    ) {
        validarGestor(userId);
        questaoService.deletar(id);
    }

    // ------------ RESPONDER QUESTÃO AVULSA (ALUNO) ------------
    @PostMapping("/responder")
    public QuestaoRespostaDTOs.ResponderResponse responder(
            @RequestBody QuestaoRespostaDTOs.ResponderRequest req
    ) {
        return questaoRespostaService.responder(req);
    }
}
