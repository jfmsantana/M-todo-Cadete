package com.example.backend.repository;
import com.example.backend.model.Tentativa;
import com.example.backend.model.Usuario;
import com.example.backend.model.Simulado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TentativaRepository extends JpaRepository<Tentativa, Long> {
    Optional<Tentativa> findFirstBySimuladoAndAlunoAndStatus(Simulado s, Usuario a, Tentativa.Status status);
}
