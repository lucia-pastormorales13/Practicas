package com.practica.todo.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;

@Repository
public interface Tareasrep extends JpaRepository  <Tarea, Integer>{

    @Query("SELECT t FROM Tarea t WHERE t.proyecto = :proyecto")
    List<Tarea> findByProyecto(Proyecto proyecto);

    //List<Tarea> findByid_asignado(Long id_usuario);

    long countByEstado(String estado);
}