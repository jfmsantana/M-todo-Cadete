// src/main/java/com/example/backend/service/TentativaService.java
package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import com.example.backend.web.dto.TentativaDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TentativaService {

    private final TentativaRepository tentativaRepo;
    private final SimuladoRepository simuladoRepo;
    private final UsuarioRepository usuarioRepo;
    private final QuestaoRepository questaoRepo;
    private final RespostaSimuladoRepository respostaSimuladoRepo;

    public Tentativa iniciar(Long simuladoId, Long alunoId) {

        Simulado simulado = simuladoRepo.findById(simuladoId)
                .orElseThrow(() -> new IllegalArgumentException("Simulado não encontrado: " + simuladoId));

        Usuario aluno = usuarioRepo.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + alunoId));

        Optional<Tentativa> existente =
                tentativaRepo.findFirstBySimuladoAndAlunoAndStatus(simulado, aluno, Tentativa.Status.EM_ANDAMENTO);

        if (existente.isPresent()) return existente.get();

        Tentativa tentativa = Tentativa.builder()
                .simulado(simulado)
                .aluno(aluno)
                .status(Tentativa.Status.EM_ANDAMENTO)
                .inicio(LocalDateTime.now())
                .totalQuestoes(simulado.getQuestoes().size())
                .build();

        List<RespostaSimulado> respostas = simulado.getQuestoes().stream()
                .map(q -> RespostaSimulado.builder()
                        .tentativa(tentativa)
                        .questao(q)
                        .marcada(" ")
                        .correta(false)
                        .build())
                .collect(Collectors.toList());

        tentativa.setRespostas(respostas);

        return tentativaRepo.save(tentativa);
    }

    public Tentativa responder(Long tentativaId, List<TentativaDTOs.Item> itens) {
        Tentativa tentativa = tentativaRepo.findById(tentativaId)
                .orElseThrow(() -> new IllegalArgumentException("Tentativa não encontrada: " + tentativaId));

        if (tentativa.getStatus() != Tentativa.Status.EM_ANDAMENTO)
            throw new IllegalArgumentException("Tentativa não está em andamento.");

        Map<Long, String> mapa = itens.stream()
                .collect(Collectors.toMap(TentativaDTOs.Item::getQuestaoId, TentativaDTOs.Item::getMarcada));

        for (RespostaSimulado r : tentativa.getRespostas()) {
            String marcada = mapa.get(r.getQuestao().getId());
            if (marcada != null) {
                r.setMarcada(marcada);
            }
        }

        respostaSimuladoRepo.saveAll(tentativa.getRespostas());
        return tentativa;
    }

    public TentativaDTOs.Resultado entregar(Long tentativaId) {
        Tentativa tentativa = tentativaRepo.findById(tentativaId)
                .orElseThrow(() -> new IllegalArgumentException("Tentativa não encontrada: " + tentativaId));

        if (tentativa.getStatus() != Tentativa.Status.EM_ANDAMENTO)
            throw new IllegalArgumentException("Tentativa já foi entregue.");

        int acertos = 0;
        List<TentativaDTOs.GabaritoItem> gabarito = new ArrayList<>();

        for (RespostaSimulado r : tentativa.getRespostas()) {
            Questao q = r.getQuestao();
            boolean ok = q.getCorreta().equalsIgnoreCase(r.getMarcada());
            r.setCorreta(ok);
            if (ok) acertos++;

            TentativaDTOs.GabaritoItem gi = new TentativaDTOs.GabaritoItem();
            gi.setQuestaoId(q.getId());
            gi.setCorreta(q.getCorreta());
            gi.setMarcada(r.getMarcada());
            gi.setAcertou(ok);
            gabarito.add(gi);
        }

        respostaSimuladoRepo.saveAll(tentativa.getRespostas());

        tentativa.setAcertos(acertos);
        tentativa.setEntrega(LocalDateTime.now());
        tentativa.setStatus(Tentativa.Status.ENTREGUE);
        tentativaRepo.save(tentativa);

        TentativaDTOs.Resultado res = new TentativaDTOs.Resultado();
        res.setTentativaId(tentativa.getId());
        res.setTotal(tentativa.getTotalQuestoes());
        res.setAcertos(acertos);
        res.setGabarito(gabarito);

        return res;
    }

    public TentativaDTOs.Resultado statusParcial(Long tentativaId) {
        Tentativa tentativa = tentativaRepo.findById(tentativaId)
                .orElseThrow(() -> new IllegalArgumentException("Tentativa não encontrada: " + tentativaId));

        TentativaDTOs.Resultado res = new TentativaDTOs.Resultado();
        res.setTentativaId(tentativa.getId());
        res.setTotal(tentativa.getTotalQuestoes());

        if (tentativa.getStatus() == Tentativa.Status.ENTREGUE) {
            res.setAcertos(tentativa.getAcertos());
            res.setGabarito(null);
        } else {
            res.setAcertos(0);
            res.setGabarito(null);
        }
        return res;
    }
}
