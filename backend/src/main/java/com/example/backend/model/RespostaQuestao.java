// src/main/java/com/example/backend/model/RespostaQuestao.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "respostas_questao")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespostaQuestao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // usuário que respondeu
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // questão respondida
    @ManyToOne(optional = false)
    @JoinColumn(name = "questao_id")
    private Questao questao;

    // alternativa marcada ("A","B","C","D")
    @Column(nullable = false)
    private String alternativa;

    // se a resposta estava correta na hora
    @Column(nullable = false)
    private boolean correta;

    private LocalDateTime dataHora;
}
