package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "simulados")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Simulado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column
    private String descricao;

    @ManyToMany
    @JoinTable(name = "simulado_questoes",
            joinColumns = @JoinColumn(name = "simulado_id"),
            inverseJoinColumns = @JoinColumn(name = "questao_id"))
    @OrderColumn(name = "ordem") // mantém ordem definida na lista
    private List<Questao> questoes = new ArrayList<>();
}
