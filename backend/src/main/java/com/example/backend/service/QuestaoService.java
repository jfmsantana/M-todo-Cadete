package com.example.backend.service;

import com.example.backend.model.Questao;
import com.example.backend.model.Questao.Materia;
import com.example.backend.model.Questao.Nivel;
import com.example.backend.repository.QuestaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestaoService {
    private final QuestaoRepository repo;

    private void validar(Questao q) {
        if (q.getEnunciado() == null || q.getEnunciado().isBlank())
            throw new IllegalArgumentException("Enunciado é obrigatório");
        if (q.getCorreta() == null || !"ABCD".contains(q.getCorreta()))
            throw new IllegalArgumentException("Alternativa correta deve ser A, B, C ou D");
        if (q.getMateria() == null)
            throw new IllegalArgumentException("Matéria é obrigatória");
        if (q.getNivel() == null)
            throw new IllegalArgumentException("Nível é obrigatório");
    }

    public Questao criar(Questao q) { validar(q); return repo.save(q); }

    public List<Questao> listar(String materia, String nivel) { return repo.findAll(); }

    public Questao buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Questão não encontrada: " + id));
    }

    public Questao atualizar(Long id, Questao dados) {
        Questao q = buscar(id);
        if (dados.getEnunciado() != null) q.setEnunciado(dados.getEnunciado());
        if (dados.getAlternativaA() != null) q.setAlternativaA(dados.getAlternativaA());
        if (dados.getAlternativaB() != null) q.setAlternativaB(dados.getAlternativaB());
        if (dados.getAlternativaC() != null) q.setAlternativaC(dados.getAlternativaC());
        if (dados.getAlternativaD() != null) q.setAlternativaD(dados.getAlternativaD());
        if (dados.getCorreta() != null) q.setCorreta(dados.getCorreta());
        if (dados.getMateria() != null) q.setMateria(dados.getMateria());
        if (dados.getNivel() != null) q.setNivel(dados.getNivel());
        validar(q);
        return repo.save(q);
    }

    public void deletar(Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Questão não encontrada: " + id);
        repo.deleteById(id);
    }

    public List<Questao> filtrar(Materia materia, Nivel nivel) {
        if (materia != null && nivel != null) return repo.findByMateriaAndNivel(materia, nivel);
        if (materia != null) return repo.findByMateria(materia);
        if (nivel != null) return repo.findByNivel(nivel);
        return repo.findAll();
    }
}
