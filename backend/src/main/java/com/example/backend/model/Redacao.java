package com.example.backend.model;

import com.example.backend.service.UsuarioService;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "redacoes")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Redacao {
    @Id
    @GeneratedValue
    private Long id;

    // Aqui é o autor da redação
    @ManyToOne(optional = false) //Muitas redações podem ser feitas por um aluno
    @JoinColumn(name = "aluno_id")
    private Usuario aluno;

    // Quem corrigiu (pode ser nulo até corrigir)
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Usuario professor;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texto;

    // PENDENTE, CORRIGIDA
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private Double nota;                 // nulo enquanto pendente
    @Column(columnDefinition = "TEXT")
    private String feedback;             // texto do professor

    @Column(nullable = false)
    private LocalDateTime dataSubmissao;

    private LocalDateTime dataCorrecao;

    public enum Status { PENDENTE, CORRIGIDA }

}

