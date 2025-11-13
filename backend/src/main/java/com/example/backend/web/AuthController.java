// com.example.backend.web.AuthController

package com.example.backend.web;

import com.example.backend.model.Usuario;
import com.example.backend.service.UsuarioService;
import com.example.backend.web.dto.LoginRequest;
import com.example.backend.web.dto.LoginResponse;
import com.example.backend.web.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Usuario user = usuarioService.autenticar(request.getEmail(), request.getSenha());

        LoginResponse resp = new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getPerfil().name()
        );

        return ResponseEntity.ok(resp);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getSenha() == null || request.getSenha().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Usuario novo = new Usuario();
        novo.setEmail(request.getEmail());
        novo.setSenha(request.getSenha());

        // se não vier perfil, assume ALUNO
        Usuario.Perfil perfil =
                request.getPerfil() != null
                        ? Usuario.Perfil.valueOf(request.getPerfil())
                        : Usuario.Perfil.ALUNO;

        novo.setPerfil(perfil);

        Usuario salvo = usuarioService.criar(novo);

        LoginResponse resp = new LoginResponse(
                salvo.getId(),
                salvo.getEmail(),
                salvo.getPerfil().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }
}
