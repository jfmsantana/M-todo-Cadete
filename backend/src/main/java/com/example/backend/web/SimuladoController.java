// src/main/java/com/example/backend/web/SimuladoController.java
package com.example.backend.web;

import com.example.backend.model.Simulado;
import com.example.backend.service.SimuladoService;
import com.example.backend.web.dto.SimuladoDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulados")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SimuladoController {

    private final SimuladoService simuladoService;

    // LISTAR TODOS
    @GetMapping
    public List<Simulado> listar() {
        return simuladoService.listar();
    }

    // BUSCAR POR ID (usado pelo front para carregar questões do simulado)
    @GetMapping("/{id}")
    public Simulado buscarPorId(@PathVariable Long id) {
        return simuladoService.buscarPorId(id);
    }

    // CRIAR SIMPLES (tela de Simulados atual)
    @PostMapping
    public Simulado criar(@RequestBody Simulado s) {
        return simuladoService.criar(s);
    }

    // NOVO: criar simulado escolhendo questões do Banco de Questões
    @PostMapping("/com-questoes")
    public Simulado criarComQuestoes(@RequestBody SimuladoDTOs.Criar dto) {
        return simuladoService.criarComQuestoes(dto);
    }

    // DELETAR SIMULADO (ADMIN/PROFESSOR)
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        simuladoService.deletar(id);
    }
}
