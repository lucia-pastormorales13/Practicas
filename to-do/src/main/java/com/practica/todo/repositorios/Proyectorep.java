package com.practica.todo.repositorios;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;


@Repository
public interface Proyectorep extends JpaRepository  <Proyecto, Long> {

    List <Proyecto> findByMiembrosContaining(Usuario Usuario);

}