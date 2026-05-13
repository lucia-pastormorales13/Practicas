package com.practica.todo.entidades;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class ProyectoUsuarios {
    @EmbeddedId
    private UsuarioProyectoId id;

    @ManyToOne
    @MapsId("id_usuario")
    private Usuario usuario;

    @ManyToOne
    @MapsId("id_proyecto")
    private Proyecto proyecto;
}
