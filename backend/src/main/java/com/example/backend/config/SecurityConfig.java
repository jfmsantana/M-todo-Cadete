package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Desativa proteção CSRF (para testes)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // Permite tudo
                )
                .formLogin(form -> form.disable()); // Remove a tela de login

        return http.build();
    }
}
