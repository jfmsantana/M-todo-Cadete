package com.example.backend.service;

import com.example.backend.model.Questao;
import com.example.backend.model.Simulado;
import com.example.backend.repository.QuestaoRepository;
import com.example.backend.repository.SimuladoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimuladoService {
    private final SimuladoRepository simuladoRepo;
    private final QuestaoRepository questaoRepo;

    public Simulado criar(String titulo, List<Long> questaoIds) {
        if (titulo == null || titulo.isBlank())
            throw new IllegalArgumentException("Título é obrigatório");
        if (questaoIds == null || questaoIds.isEmpty())
            throw new IllegalArgumentException("Selecione pelo menos 1 questão");

        List<Questao> questoes = questaoRepo.findAllById(questaoIds);
        if (questoes.size() != questaoIds.size())
            throw new IllegalArgumentException("Uma ou mais questões não existem");

        Simulado s = Simulado.builder()
                .titulo(titulo)
                .questoes(questoes)
                .build();
        return simuladoRepo.save(s);
    }

    public List<Simulado> listar() { return simuladoRepo.findAll(); }

    public Simulado buscar(Long id) {
        return simuladoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Simulado não encontrado: " + id));
    }
}
