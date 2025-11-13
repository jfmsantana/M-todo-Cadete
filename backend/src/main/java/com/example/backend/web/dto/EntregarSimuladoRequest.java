// com.example.backend.web.dto.EntregarSimuladoRequest
package com.example.backend.web.dto;

import lombok.Data;

import java.util.Map;

@Data
public class EntregarSimuladoRequest {
    private Long usuarioId;
    private Long simuladoId;
    // questaoId -> "A"/"B"/"C"/"D"
    private Map<Long, String> respostas;
}
