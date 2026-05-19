package com.practica.todo.dto;

import com.practica.todo.enumeration.*;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String error;
    private Role rol;
    private String nombre;
    private int id_usuario;
}
