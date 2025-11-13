package com.example.backend.web.dto;
import com.example.backend.model.Usuario;
import lombok.Data;
@Data
public class LoginRequest {

    private String email;
    private String senha;
}
