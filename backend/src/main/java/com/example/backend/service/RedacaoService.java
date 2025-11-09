package com.example.backend.service;

import com.example.backend.model.Redacao;
import com.example.backend.model.Usuario;
import com.example.backend.repository.RedacaoRepository;
import com.example.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RedacaoService {
    private final RedacaoRepository redacaoRepo;
    private final UsuarioRepository usuarioRepo;

    public Redacao criar(Long alunoId, String titulo, String texto) {
        Usuario aluno = usuarioRepo.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + alunoId));

        Redacao r = Redacao.builder()
                .aluno(aluno)
                .titulo(titulo)
                .texto(texto)
                .status(Redacao.Status.PENDENTE)
                .dataSubmissao(LocalDateTime.now())
                .build();
        return redacaoRepo.save(r);
    }

    public List<Redacao> listarTodas() { return redacaoRepo.findAll(); }

    public Redacao buscar(Long id) {
        return redacaoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Redação não encontrada: " + id));
    }

    public List<Redacao> listarDoAluno(Long alunoId) {
        Usuario aluno = usuarioRepo.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + alunoId));
        return redacaoRepo.findByAluno(aluno);
    }

    // Na correção: professor aplica nota e feedback
    public Redacao corrigir(Long redacaoId, Long professorId, Double nota, String feedback) {
        Redacao r = buscar(redacaoId);
        Usuario prof = usuarioRepo.findById(professorId)
                .orElseThrow(() -> new IllegalArgumentException("Professor não encontrado: " + professorId));

        r.setProfessor(prof);
        r.setNota(nota);
        r.setFeedback(feedback);
        r.setStatus(Redacao.Status.CORRIGIDA);
        r.setDataCorrecao(LocalDateTime.now());
        return redacaoRepo.save(r);
    }

    public void deletar(Long id) { redacaoRepo.deleteById(id); }
}
