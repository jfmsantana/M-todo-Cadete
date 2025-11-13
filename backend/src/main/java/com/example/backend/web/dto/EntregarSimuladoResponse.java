// com.example.backend.web.dto.EntregarSimuladoResponse
package com.example.backend.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EntregarSimuladoResponse {
    private int totalQuestoes;
    private int acertos;
    private double nota; // 0–10 por exemplo
}
