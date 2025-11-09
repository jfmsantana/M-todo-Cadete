package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "respostas")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Resposta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tentativa_id")
    private Tentativa tentativa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "questao_id")
    private Questao questao;

    @Column(nullable = false, length = 1)
    private String marcada; // "A" | "B" | "C" | "D"

    @Column(nullable = false)
    private Boolean correta; // calculado na entrega
}
