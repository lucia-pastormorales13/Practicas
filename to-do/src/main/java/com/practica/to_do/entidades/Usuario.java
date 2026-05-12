package com.practica.to_do.entidades;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_usuario;

    private String nombre;
    private String apellidos;

    @Column(unique = true)
    private String correo;
    
    private String contrasenia;
    private String rol;
}
