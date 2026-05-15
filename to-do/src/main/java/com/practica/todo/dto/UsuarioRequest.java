package com.practica.todo.dto;

import com.practica.todo.enumeration.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UsuarioRequest {
    private String nombre;
    private String apellidos;
    private String correo;
    private String contrasenia;
    private Role rol;
}
