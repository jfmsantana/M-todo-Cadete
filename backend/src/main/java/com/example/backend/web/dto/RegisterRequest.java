// com.example.backend.web.dto.RegisterRequest
package com.example.backend.web.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String senha;
    // opcional: se vier nulo, será ALUNO
    private String perfil;
}
