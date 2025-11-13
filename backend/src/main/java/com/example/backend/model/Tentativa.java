// src/main/java/com/example/backend/model/Tentativa.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tentativas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tentativa {

    public enum Status {
        EM_ANDAMENTO,
        ENTREGUE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // aluno que está fazendo o simulado
    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id")
    private Usuario aluno;

    // simulado associado
    @ManyToOne(optional = false)
    @JoinColumn(name = "simulado_id")
    private Simulado simulado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private LocalDateTime inicio;
    private LocalDateTime entrega;

    private Integer totalQuestoes;
    private Integer acertos;

    @OneToMany(mappedBy = "tentativa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespostaSimulado> respostas;
}
