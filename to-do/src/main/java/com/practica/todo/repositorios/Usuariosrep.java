package com.practica.todo.repositorios;
import java.util.List;
import java.util.Optional;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;

@Repository
public interface Usuariosrep extends JpaRepository  <Usuario, Long>{

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByRole(Role rol);

    boolean existsByEmail(String email);

}