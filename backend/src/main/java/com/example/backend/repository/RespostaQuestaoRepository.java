// src/main/java/com/example/backend/repository/RespostaQuestaoRepository.java
package com.example.backend.repository;

import com.example.backend.model.RespostaQuestao;
import com.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RespostaQuestaoRepository extends JpaRepository<RespostaQuestao, Long> {

    long countByUsuario(Usuario usuario);

    long countByUsuarioAndCorretaTrue(Usuario usuario);
}
