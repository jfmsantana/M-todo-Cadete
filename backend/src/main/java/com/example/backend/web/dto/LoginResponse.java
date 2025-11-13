package com.example.backend.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String email;
    private String perfil; // ADMIN, PROFESSOR, ALUNO
}

