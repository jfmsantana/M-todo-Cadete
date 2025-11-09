package com.example.backend.repository;
import com.example.backend.model.Redacao;
import com.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RedacaoRepository extends JpaRepository<Redacao, Long> {
    List<Redacao> findByAluno(Usuario aluno);
    List<Redacao> findByStatus(Redacao.Status status);
}
