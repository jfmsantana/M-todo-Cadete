// src/main/java/com/example/backend/service/SimuladoService.java
package com.example.backend.service;

import com.example.backend.model.Questao;
import com.example.backend.model.Simulado;
import com.example.backend.repository.QuestaoRepository;
import com.example.backend.repository.SimuladoRepository;
import com.example.backend.web.dto.SimuladoDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    // criação "simples" (sem escolher questões) – usada pela tela de Simulados atual
    public Simulado criar(Simulado s) {
        if (s.getTitulo() == null || s.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título do simulado é obrigatório");
        }
        return simuladoRepo.save(s);
    }

    // NOVO: criação a partir de lista de IDs de questões (Banco de Questões)
    public Simulado criarComQuestoes(SimuladoDTOs.Criar dto) {
        if (dto.getTitulo() == null || dto.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título do simulado é obrigatório");
        }
        if (dto.getQuestaoIds() == null || dto.getQuestaoIds().isEmpty()) {
            throw new IllegalArgumentException("Selecione pelo menos uma questão.");
        }

        List<Questao> questoes = questaoRepo.findAllById(dto.getQuestaoIds());
        if (questoes.isEmpty()) {
            throw new IllegalArgumentException("Nenhuma questão encontrada para os IDs informados.");
        }

        Simulado simulado = Simulado.builder()
                .titulo(dto.getTitulo())
                .questoes(questoes)
                .build();

        // Ao salvar, o relacionamento ManyToMany Simulado<->Questao é criado
        // e passamos a saber em quais simulados cada questão foi usada.
        return simuladoRepo.save(simulado);
    }

    public void deletar(Long id) {
        if (!simuladoRepo.existsById(id)) {
            throw new IllegalArgumentException("Simulado não encontrado: " + id);
        }
        simuladoRepo.deleteById(id);
    }
}
