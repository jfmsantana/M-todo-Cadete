// web/dto/SimuladoDTOs.java
package com.example.backend.web.dto;

import lombok.Data;
import java.util.List;

public class SimuladoDTOs {
    @Data
    public static class Criar {
        private String titulo;
        private List<Long> questaoIds;
    }
}
