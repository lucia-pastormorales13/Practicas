package com.practica.todo.entidades;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_tarea;

    private String titulo;
    private String descripcion;
    private String estado;
    private LocalDateTime fecha_entrega;
    private String prioridad;

    @ManyToOne
    @JoinColumn(name = "id_proyecto")
    private Proyecto proyecto;
}
