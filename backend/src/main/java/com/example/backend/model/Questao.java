package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Transient;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany(mappedBy = "questoes")
    @JsonIgnore
    private List<Simulado> simulados = new ArrayList<>();

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

    @Transient
    @JsonProperty("statusUso")
    public String getStatusUso() {
        if (simulados == null || simulados.isEmpty()) {
            return null; // ou "Nunca utilizada em simulados" se preferir
        }

        if (simulados.size() == 1) {
            return "Já utilizada no Simulado " + simulados.get(0).getTitulo();
        }

        // se já foi usada em vários, mostramos algo mais genérico
        return "Já utilizada em " + simulados.size() +
                " simulados (ex.: " + simulados.get(0).getTitulo() + ")";
    }

    public enum Materia { PORTUGUES, MATEMATICA, INGLES }
    public enum Nivel { FIXACAO, NIVELAMENTO, CONCURSO }
}