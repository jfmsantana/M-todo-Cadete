// src/main/java/com/example/backend/web/dto/QuestaoRespostaDTOs.java
package com.example.backend.web.dto;

import lombok.Data;

public class QuestaoRespostaDTOs {

    @Data
    public static class ResponderRequest {
        private Long usuarioId;
        private Long questaoId;
        private String alternativa; // "A","B","C","D"
    }

    @Data
    public static class ResponderResponse {
        private boolean correta;
        private String alternativaCorreta;

        private long totalRespondidas;
        private long totalAcertos;
        private double aproveitamento; // 0–100
    }
}
