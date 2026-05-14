package com.practica.todo.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IniciarRequest {
    private String correo;
    private String contrasenia;
}
