package com.practica.todo.repositorios;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;


@Repository
public interface Proyectorep extends JpaRepository  <Proyecto, Integer> {

    List <Proyecto> findByMiembrosContaining(Usuario Usuario);
   

}