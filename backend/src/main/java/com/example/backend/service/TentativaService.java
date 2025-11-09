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
    private final RespostaRepository respostaRepo;

    public Tentativa iniciar(Long simuladoId, Long alunoId) {
        Simulado s = simuladoRepo.findById(simuladoId)
                .orElseThrow(() -> new IllegalArgumentException("Simulado não encontrado: " + simuladoId));
        Usuario a = usuarioRepo.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado: " + alunoId));

        // se já houver EM_ANDAMENTO, retorna a mesma (não cria outra)
        Optional<Tentativa> existente = tentativaRepo.findFirstBySimuladoAndAlunoAndStatus(
                s, a, Tentativa.Status.EM_ANDAMENTO);
        if (existente.isPresent()) return existente.get();

        Tentativa t = Tentativa.builder()
                .simulado(s)
                .aluno(a)
                .status(Tentativa.Status.EM_ANDAMENTO)
                .inicio(LocalDateTime.now())
                .totalQuestoes(s.getQuestoes().size())
                .build();

        // cria respostas em branco (sem correta ainda)
        List<Resposta> respostas = s.getQuestoes().stream().map(q ->
                Resposta.builder().tentativa(t).questao(q).marcada(" ").correta(false).build()
        ).collect(Collectors.toList());
        t.setRespostas(respostas);
        return tentativaRepo.save(t); // cascade salva respostas também
    }

    public Tentativa responder(Long tentativaId, List<TentativaDTOs.Item> itens) {
        Tentativa t = tentativaRepo.findById(tentativaId)
                .orElseThrow(() -> new IllegalArgumentException("Tentativa não encontrada: " + tentativaId));
        if (t.getStatus() != Tentativa.Status.EM_ANDAMENTO)
            throw new IllegalArgumentException("Tentativa não está em andamento");

        // map questaoId->marcada
        Map<Long, String> mapa = itens.stream()
                .collect(Collectors.toMap(TentativaDTOs.Item::getQuestaoId, TentativaDTOs.Item::getMarcada));

        // atualiza marcadas nas respostas existentes
        for (Resposta r : t.getRespostas()) {
            String marcada = mapa.get(r.getQuestao().getId());
            if (marcada != null) r.setMarcada(marcada);
        }
        respostaRepo.saveAll(t.getRespostas());
        return t;
    }

    public TentativaDTOs.Resultado entregar(Long tentativaId) {
        Tentativa t = tentativaRepo.findById(tentativaId)
                .orElseThrow(() -> new IllegalArgumentException("Tentativa não encontrada: " + tentativaId));
        if (t.getStatus() != Tentativa.Status.EM_ANDAMENTO)
            throw new IllegalArgumentException("Tentativa já foi entregue");

        // corrige: compara marcada x correta de cada questão
        int acertos = 0;
        List<TentativaDTOs.GabaritoItem> gabarito = new ArrayList<>();

        for (Resposta r : t.getRespostas()) {
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
        respostaRepo.saveAll(t.getRespostas());

        t.setAcertos(acertos);
        t.setEntrega(LocalDateTime.now());
        t.setStatus(Tentativa.Status.ENTREGUE);
        tentativaRepo.save(t);

        TentativaDTOs.Resultado res = new TentativaDTOs.Resultado();
        res.setTentativaId(t.getId());
        res.setAcertos(acertos);
        res.setTotal(t.getTotalQuestoes());
        res.setGabarito(gabarito); // mostramos gabarito APÓS entrega
        return res;
    }

    public TentativaDTOs.Resultado statusParcial(Long tentativaId) {
        Tentativa t = tentativaRepo.findById(tentativaId)
                .orElseThrow(() -> new IllegalArgumentException("Tentativa não encontrada: " + tentativaId));

        TentativaDTOs.Resultado res = new TentativaDTOs.Resultado();
        res.setTentativaId(t.getId());
        res.setTotal(t.getTotalQuestoes());

        if (t.getStatus() == Tentativa.Status.ENTREGUE) {
            res.setAcertos(t.getAcertos());
            // após entregue, podemos incluir gabarito completo (se quiser reusar a entrega para consultar)
            // aqui, por padrão, não devolvemos gabarito de novo
            res.setGabarito(null);
        } else {
            // EM_ANDAMENTO: NÃO mostrar gabarito
            res.setAcertos(0);
            res.setGabarito(null);
        }
        return res;
    }
}
