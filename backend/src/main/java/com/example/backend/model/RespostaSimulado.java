// src/main/java/com/example/backend/model/RespostaSimulado.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "respostas_simulado")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespostaSimulado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tentativa_id")
    private Tentativa tentativa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "questao_id")
    private Questao questao;

    // alternativa marcada ("A","B","C","D" ou " ")
    @Column(nullable = false)
    private String marcada;

    @Column(nullable = false)
    private boolean correta;
}
