package com.example.backend.web;

import com.example.backend.model.Simulado;
import com.example.backend.service.SimuladoService;
import com.example.backend.web.dto.SimuladoDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simulados")
@RequiredArgsConstructor
public class SimuladoController {

    private final SimuladoService service;

    @PostMapping
    public Simulado criar(@RequestBody SimuladoDTOs.Criar body) {
        return service.criar(body.getTitulo(), body.getQuestaoIds());
    }

    @GetMapping
    public List<Simulado> listar() { return service.listar(); }

    @GetMapping("/{id}")
    public Simulado buscar(@PathVariable Long id) { return service.buscar(id); }
}
