package com.practica.todo.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practica.todo.entidades.ProyectoUsuarios;

public interface ProyectoUsuariosrep extends JpaRepository<ProyectoUsuarios, Integer> {
    
    List<ProyectoUsuarios> findByUsuarioid_usuario(int id_usuario);

    List<ProyectoUsuarios> findByProyectoid_proyecto(int id_proyecto);

}