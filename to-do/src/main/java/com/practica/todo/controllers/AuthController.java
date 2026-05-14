package com.practica.todo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.practica.todo.repositorios.Usuariosrep;

import lombok.*;

@RestController
@AllArgsConstructor
public class AuthController {
    private final Usuariosrep usuarioRepository;
    private final PasswordEncoder passwordEncoder;

}