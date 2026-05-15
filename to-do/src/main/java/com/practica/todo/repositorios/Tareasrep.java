package com.practica.todo.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;

@Repository
public interface Tareasrep extends JpaRepository  <Tarea, Integer>{

    //List<Tarea> findByid_proyecto(Long id_proyecto);

    //List<Tarea> findByid_asignado(Long id_usuario);

    long countByEstado(String estado);
}