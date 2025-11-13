package com.example.backend.web;

import com.example.backend.model.Redacao;
import com.example.backend.service.RedacaoService;
import com.example.backend.web.dto.RedacaoDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/redacoes")
@RequiredArgsConstructor
public class RedacaoController {

    private final RedacaoService service;

    @PostMapping
    public Redacao criar(@RequestBody RedacaoDTOs.Criar body) {
        return service.criar(body.getAlunoId(), body.getTitulo(), body.getTexto());
    }

    @GetMapping
    public List<Redacao> listar() { return service.listarTodas(); }

    @GetMapping(params = "status")
    public List<Redacao> listarPorStatus(@RequestParam Redacao.Status status) {
        return service.listarPorStatus(status);
    }


    @GetMapping("/{id}")
    public Redacao buscar(@PathVariable Long id) { return service.buscar(id); }

    @GetMapping("/aluno/{alunoId}")
    public List<Redacao> listarDoAluno(@PathVariable Long alunoId) {
        return service.listarDoAluno(alunoId);
    }

    @PostMapping("/{id}/corrigir")
    public Redacao corrigir(@PathVariable Long id, @RequestBody RedacaoDTOs.Corrigir body) {
        return service.corrigir(id, body.getProfessorId(), body.getNota(), body.getFeedback());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) { service.deletar(id); }
}
