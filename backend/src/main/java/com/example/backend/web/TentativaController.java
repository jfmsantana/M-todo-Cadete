// src/main/java/com/example/backend/web/TentativaController.java
package com.example.backend.web;

import com.example.backend.model.Tentativa;
import com.example.backend.service.TentativaService;
import com.example.backend.web.dto.TentativaDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TentativaController {

    private final TentativaService tentativaService;

    @PostMapping("/simulados/{simuladoId}/iniciar")
    public TentativaDTOs.IniciarResponse iniciar(
            @PathVariable Long simuladoId,
            @RequestBody TentativaDTOs.IniciarRequest body
    ) {
        Tentativa tentativa = tentativaService.iniciar(simuladoId, body.getAlunoId());

        TentativaDTOs.IniciarResponse res = new TentativaDTOs.IniciarResponse();
        res.setTentativaId(tentativa.getId());
        return res;
    }

    @PostMapping("/tentativas/{tentativaId}/responder")
    public void responder(
            @PathVariable Long tentativaId,
            @RequestBody TentativaDTOs.ResponderRequest body
    ) {
        tentativaService.responder(tentativaId, body.getItens());
    }

    @PostMapping("/tentativas/{tentativaId}/entregar")
    public TentativaDTOs.Resultado entregar(@PathVariable Long tentativaId) {
        return tentativaService.entregar(tentativaId);
    }

    @GetMapping("/tentativas/{tentativaId}")
    public TentativaDTOs.Resultado status(@PathVariable Long tentativaId) {
        return tentativaService.statusParcial(tentativaId);
    }
}
