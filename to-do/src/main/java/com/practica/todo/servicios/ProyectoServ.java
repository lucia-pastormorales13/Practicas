package com.practica.todo.servicios;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.Role;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Proyectorep;

@Service
public class ProyectoServ {

    @Autowired
    private Proyectorep proyectoRepository;

    @PreAuthorize("hasRole('gestor_proyecto')")
    public Proyecto crearProyecto(Proyecto proyecto, Usuario gestor) {
        return proyectoRepository.save(proyecto);
    }

    public List<Proyecto> ListarMisProyectos(Usuario usuario) {
        if (usuario.getRol() == Role.administrador) {
            return proyectoRepository.findAll();
        }
        return proyectoRepository.findByMiembrosContaining(usuario);
    }
}