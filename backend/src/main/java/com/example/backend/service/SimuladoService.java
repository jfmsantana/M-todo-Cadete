// src/main/java/com/example/backend/service/SimuladoService.java
package com.example.backend.service;

import com.example.backend.model.Questao;
import com.example.backend.model.Simulado;
import com.example.backend.repository.QuestaoRepository;
import com.example.backend.repository.SimuladoRepository;
import com.example.backend.web.dto.SimuladoDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimuladoService {

    private final SimuladoRepository simuladoRepo;
    private final QuestaoRepository questaoRepo;

    public List<Simulado> listar() {
        return simuladoRepo.findAll();
    }

    public Simulado buscarPorId(Long id) {
        return simuladoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Simulado não encontrado: " + id));
    }

    public Simulado criar(String titulo, String descricao, List<Long> questaoIds) {
        if (titulo == null || titulo.isBlank()) {
            throw new IllegalArgumentException("Título do simulado é obrigatório");
        }

        List<Questao> questoes = new ArrayList<>();
        if (questaoIds != null && !questaoIds.isEmpty()) {
            questoes = questaoRepo.findAllById(questaoIds);
        }

        Simulado s = new Simulado();
        s.setTitulo(titulo);
        s.setDescricao(descricao);
        s.setQuestoes(questoes);

        return simuladoRepo.save(s);
    }

    public void deletar(Long id) {
        if (!simuladoRepo.existsById(id)) {
            throw new IllegalArgumentException("Simulado não encontrado: " + id);
        }
        simuladoRepo.deleteById(id);
    }
}
