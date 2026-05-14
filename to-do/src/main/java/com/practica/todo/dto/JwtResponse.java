package com.practica.todo.dto;

import com.practica.todo.entidades.Role;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String error;
    private Role role;
    private String name;
    private int id_usuario;
}
