// model/Tentativa.java
package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tentativas")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Tentativa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id")
    private Usuario aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "simulado_id")
    private Simulado simulado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status; // EM_ANDAMENTO, ENTREGUE, CORRIGIDA (corrigimos na entrega)

    private Integer acertos;      // preenchido na entrega
    private Integer totalQuestoes; // redundância útil p/ histórico

    private LocalDateTime inicio;
    private LocalDateTime entrega;

    @OneToMany(mappedBy = "tentativa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resposta> respostas;

    public enum Status { EM_ANDAMENTO, ENTREGUE, CORRIGIDA }
}
