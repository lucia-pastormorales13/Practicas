package com.practica.todo.dto;

import javax.management.relation.Role;

import lombok.*;

@Data
@AllArgsConstructor
public class RegistrarRequest {
    private String nombre;
    private String apellidos;
    private String correo;
    private String contrasenia;
    private Role rol;
}
