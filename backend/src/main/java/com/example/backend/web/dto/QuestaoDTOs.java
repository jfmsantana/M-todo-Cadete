package com.example.backend.web.dto;

import com.example.backend.model.Questao.Materia;
import com.example.backend.model.Questao.Nivel;
import lombok.Data;

public class QuestaoDTOs {
    @Data
    public static class CriarOuAtualizar {
        private String enunciado;
        private String alternativaA;
        private String alternativaB;
        private String alternativaC;
        private String alternativaD;
        private String correta;     // "A" | "B" | "C" | "D"
        private Materia materia;    // PORTUGUES | MATEMATICA | INGLES
        private Nivel nivel;        // FIXACAO | NIVELAMENTO | CONCURSO
    }
}