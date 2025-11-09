package com.example.backend.web;

import com.example.backend.model.Tentativa;
import com.example.backend.service.TentativaService;
import com.example.backend.web.dto.TentativaDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tentativas")
@RequiredArgsConstructor
public class TentativaController {

    private final TentativaService service;

    // Inicia (ou retorna EM_ANDAMENTO) para um simulado/aluno
    @PostMapping("/simulado/{simuladoId}/iniciar")
    public Tentativa iniciar(@PathVariable Long simuladoId, @RequestBody TentativaDTOs.Iniciar body) {
        return service.iniciar(simuladoId, body.getAlunoId());
    }

    // Envia marcações parciais/por bloco (não entrega)
    @PostMapping("/{tentativaId}/responder")
    public Tentativa responder(@PathVariable Long tentativaId, @RequestBody TentativaDTOs.Responder body) {
        return service.responder(tentativaId, body.getRespostas());
    }

    // Entrega e devolve gabarito + nota
    @PostMapping("/{tentativaId}/entregar")
    public TentativaDTOs.Resultado entregar(@PathVariable Long tentativaId) {
        return service.entregar(tentativaId);
    }

    // Consulta status sem gabarito (EM_ANDAMENTO) ou resumo (ENTREGUE)
    @GetMapping("/{tentativaId}/status")
    public TentativaDTOs.Resultado status(@PathVariable Long tentativaId) {
        return service.statusParcial(tentativaId);
    }
}
