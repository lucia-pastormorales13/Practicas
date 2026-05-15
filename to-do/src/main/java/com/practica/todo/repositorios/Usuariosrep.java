package com.practica.todo.repositorios;
import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;
import com.practica.todo.enumeration.Role;

@Repository
public interface Usuariosrep extends JpaRepository  <Usuario, Integer>{

    Optional<Usuario> findByCorreo(String correo);

    List<Usuario> findByRol(Role rol);

    boolean existsByCorreo(String correo);

}