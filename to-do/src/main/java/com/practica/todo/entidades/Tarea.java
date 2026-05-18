package com.practica.todo.entidades;

import java.time.LocalDate;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tarea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_tarea;

    private String titulo;
    private String descripcion;
    private String estado;
    private LocalDate fecha_entrega;
    private String prioridad;

    @ManyToOne
    @JoinColumn(name = "id_proyecto")
    private Proyecto proyecto;
}
