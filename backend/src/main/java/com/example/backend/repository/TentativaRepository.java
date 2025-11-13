// src/main/java/com/example/backend/repository/TentativaRepository.java
package com.example.backend.repository;

import com.example.backend.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TentativaRepository extends JpaRepository<Tentativa, Long> {

    Optional<Tentativa> findFirstBySimuladoAndAlunoAndStatus(
            Simulado simulado,
            Usuario aluno,
            Tentativa.Status status
    );
}
