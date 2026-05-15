package com.practica.todo.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class RegistrarRequest {
    private String nombre;
    private String apellidos;
    private String correo;
    private String contrasenia;
}
