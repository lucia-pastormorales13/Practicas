package com.practica.todo.repositorios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.practica.todo.entidades.*;

@Repository
public interface Tareasrep extends JpaRepository  <Tarea, Integer>{

    
}