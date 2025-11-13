// src/main/java/com/example/backend/service/SimuladoService.java
package com.example.backend.service;

import com.example.backend.model.Simulado;
import com.example.backend.repository.SimuladoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SimuladoService {

    private final SimuladoRepository simuladoRepo;

    public List<Simulado> listar() {
        return simuladoRepo.findAll();
    }

    public Simulado buscarPorId(Long id) {
        return simuladoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Simulado não encontrado: " + id));
    }

    public Simulado criar(Simulado s) {
        if (s.getTitulo() == null || s.getTitulo().isBlank()) {
            throw new IllegalArgumentException("Título do simulado é obrigatório");
        }
        // descrição opcional; lista de questões pode estar vazia no início
        return simuladoRepo.save(s);
    }

    public void deletar(Long id) {
        if (!simuladoRepo.existsById(id)) {
            throw new IllegalArgumentException("Simulado não encontrado: " + id);
        }
        simuladoRepo.deleteById(id);
    }
}
