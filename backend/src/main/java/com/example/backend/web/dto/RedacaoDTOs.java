package com.example.backend.web.dto;

import lombok.Data;

public class RedacaoDTOs {

    @Data
    public static class Criar {
        private Long alunoId;
        private String titulo;
        private String texto;
    }

    @Data
    public static class Corrigir {
        private Long professorId;
        private Double nota;
        private String feedback;
    }
}
