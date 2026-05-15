package com.practica.todo.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.practica.todo.entidades.ProyectoUsuarios;

public interface ProyectoUsuariosrep extends JpaRepository<ProyectoUsuarios, Integer> {
    
    @Query("SELECT pu FROM ProyectoUsuarios pu WHERE pu.usuario.id_usuario = :id")
    List<ProyectoUsuarios> findByUsuario_Id_usuario(@Param("id") Integer id);

    @Query("SELECT pu FROM ProyectoUsuarios pu WHERE pu.proyecto.id_proyecto = :id")
    List<ProyectoUsuarios> findByProyecto_Id_proyecto(@Param("id") Integer id);

}