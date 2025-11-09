package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Questao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Column(nullable = false) private String alternativaA;
    @Column(nullable = false) private String alternativaB;
    @Column(nullable = false) private String alternativaC;
    @Column(nullable = false) private String alternativaD;

    @Column(nullable = false, length = 1)
    private String correta; // "A", "B", "C" ou "D"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Materia materia; // PORTUGUES, MATEMATICA, INGLES

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Nivel nivel; // FIXACAO, NIVELAMENTO, CONCURSO

    public enum Materia { PORTUGUES, MATEMATICA, INGLES }
    public enum Nivel { FIXACAO, NIVELAMENTO, CONCURSO }
}