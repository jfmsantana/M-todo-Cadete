package com.example.backend.repository;

import com.example.backend.model.Questao;
import com.example.backend.model.Questao.Materia;
import com.example.backend.model.Questao.Nivel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestaoRepository extends JpaRepository<Questao, Long> {
    List<Questao> findByMateria(Materia materia);
    List<Questao> findByNivel(Nivel nivel);
    List<Questao> findByMateriaAndNivel(Materia materia, Nivel nivel);
}
