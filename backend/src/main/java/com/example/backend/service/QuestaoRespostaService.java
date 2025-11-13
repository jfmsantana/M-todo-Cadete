// src/main/java/com/example/backend/service/QuestaoRespostaService.java
package com.example.backend.service;

import com.example.backend.model.Questao;
import com.example.backend.model.RespostaQuestao;
import com.example.backend.model.Usuario;
import com.example.backend.repository.QuestaoRepository;
import com.example.backend.repository.RespostaQuestaoRepository;
import com.example.backend.repository.UsuarioRepository;
import com.example.backend.web.dto.QuestaoRespostaDTOs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuestaoRespostaService {

    private final UsuarioRepository usuarioRepo;
    private final QuestaoRepository questaoRepo;
    private final RespostaQuestaoRepository respostaQuestaoRepo;

    public QuestaoRespostaDTOs.ResponderResponse responder(QuestaoRespostaDTOs.ResponderRequest req) {

        Usuario usuario = usuarioRepo.findById(req.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado: " + req.getUsuarioId()));

        Questao questao = questaoRepo.findById(req.getQuestaoId())
                .orElseThrow(() -> new IllegalArgumentException("Questão não encontrada: " + req.getQuestaoId()));

        boolean correta = questao.getCorreta().equalsIgnoreCase(req.getAlternativa());

        RespostaQuestao resposta = RespostaQuestao.builder()
                .usuario(usuario)
                .questao(questao)
                .alternativa(req.getAlternativa())
                .correta(correta)
                .dataHora(LocalDateTime.now())
                .build();

        respostaQuestaoRepo.save(resposta);

        long total = respostaQuestaoRepo.countByUsuario(usuario);
        long acertos = respostaQuestaoRepo.countByUsuarioAndCorretaTrue(usuario);
        double aproveitamento = total > 0 ? (acertos * 100.0 / total) : 0.0;

        QuestaoRespostaDTOs.ResponderResponse resp = new QuestaoRespostaDTOs.ResponderResponse();
        resp.setCorreta(correta);
        resp.setAlternativaCorreta(questao.getCorreta());
        resp.setTotalRespondidas(total);
        resp.setTotalAcertos(acertos);
        resp.setAproveitamento(aproveitamento);
        return resp;
    }
}
