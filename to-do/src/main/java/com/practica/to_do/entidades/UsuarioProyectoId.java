package com.practica.to_do.entidades;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class UsuarioProyectoId implements Serializable{
    private int idProyecto;
    private int idUsusario;
}
