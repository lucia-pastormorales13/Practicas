package com.practica.to_do.entidades;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
public class Proyecto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_proyecto;

    private String nombre;
    private String descripcion;
    private String estado;
    private LocalDateTime fecha_inicio;
    private LocalDateTime fecha_limite;

    @OneToMany(mappedBy = "proyecto")
    private List<Tarea> tareas;
}
