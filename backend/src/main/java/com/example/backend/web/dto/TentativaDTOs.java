// web/dto/TentativaDTOs.java
package com.example.backend.web.dto;

import lombok.Data;
import java.util.List;

public class TentativaDTOs {

    @Data
    public static class Iniciar {
        private Long alunoId;
    }

    @Data
    public static class Responder {
        private List<Item> respostas; // {questaoId, marcada}
    }

    @Data
    public static class Item {
        private Long questaoId;
        private String marcada; // "A"|"B"|"C"|"D"
    }

    // resposta enviada ao frontend após ENTREGA
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
        private int acertos;
        private int total;
        private List<GabaritoItem> gabarito; // só preenchido se ENTREGUE
    }
}
