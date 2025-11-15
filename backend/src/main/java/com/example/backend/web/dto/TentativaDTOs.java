// src/main/java/com/example/backend/web/dto/TentativaDTOs.java
package com.example.backend.web.dto;

import lombok.Data;

import java.util.List;

public class TentativaDTOs {

    @Data
    public static class IniciarRequest {
        private Long alunoId;
    }

    @Data
    public static class IniciarResponse {
        private Long tentativaId;
    }

    @Data
    public static class Item {
        private Long questaoId;
        private String marcada;
    }

    @Data
    public static class ResponderRequest {
        private List<Item> itens;
    }

    @Data
    public static class GabaritoItem {
        private Long questaoId;
        private String correta;
        private String marcada;
        private boolean acertou;
    }

    @Data
    public static class Resultado {
        private Long tentativaId;
        private int total;
        private int acertos;
        private List<GabaritoItem> gabarito; // só após entrega
    }
}
