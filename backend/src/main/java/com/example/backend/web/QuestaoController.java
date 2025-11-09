package com.example.backend.web;

import com.example.backend.model.Questao;
import com.example.backend.model.Questao.Materia;
import com.example.backend.model.Questao.Nivel;
import com.example.backend.service.QuestaoService;
import com.example.backend.web.dto.QuestaoDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questoes")
@RequiredArgsConstructor
public class QuestaoController {

    private final QuestaoService service;

    @PostMapping
    public Questao criar(@RequestBody QuestaoDTOs.CriarOuAtualizar body) {
        Questao q = Questao.builder()
                .enunciado(body.getEnunciado())
                .alternativaA(body.getAlternativaA())
                .alternativaB(body.getAlternativaB())
                .alternativaC(body.getAlternativaC())
                .alternativaD(body.getAlternativaD())
                .correta(body.getCorreta())
                .materia(body.getMateria())
                .nivel(body.getNivel())
                .build();
        return service.criar(q);
    }

    @GetMapping
    public List<Questao> listar(
            @RequestParam(required = false) Materia materia,
            @RequestParam(required = false) Nivel nivel) {
        return service.filtrar(materia, nivel);
    }

    @GetMapping("/{id}")
    public Questao buscar(@PathVariable Long id) { return service.buscar(id); }

    @PutMapping("/{id}")
    public Questao atualizar(@PathVariable Long id, @RequestBody QuestaoDTOs.CriarOuAtualizar body) {
        Questao dados = Questao.builder()
                .enunciado(body.getEnunciado())
                .alternativaA(body.getAlternativaA())
                .alternativaB(body.getAlternativaB())
                .alternativaC(body.getAlternativaC())
                .alternativaD(body.getAlternativaD())
                .correta(body.getCorreta())
                .materia(body.getMateria())
                .nivel(body.getNivel())
                .build();
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) { service.deletar(id); }
}
