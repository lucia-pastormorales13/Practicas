package com.practica.todo.entidades;

import com.practica.todo.enumeration.Role;

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

    @Enumerated(EnumType.STRING)
    private Role rol;

    public Usuario(String nombre, String apellidos, String correo, String contrasenia) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
        this.contrasenia = contrasenia;
    }

    public Usuario(String nombre, String apellidos, String correo, String contrasenia, Role rol) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.rol = rol;
    }
}
