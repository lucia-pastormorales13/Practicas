package com.practica.todo.servicios;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.Role;
import com.practica.todo.entidades.Tarea;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Proyectorep;
import com.practica.todo.repositorios.Tareasrep;

@Service
public class ProyectoServ {

    @Autowired
    private Proyectorep proyectoRepository;

    @Autowired
    private Tareasrep tareaRepository;

    @PreAuthorize("hasRole('gestor_proyecto')")
    public Proyecto crearProyecto(Proyecto proyecto) {
        return proyectoRepository.save(proyecto);
    }

    public List<Proyecto> ListarMisProyectos(Usuario usuario) {
        if (usuario.getRol() == Role.administrador) {
            return proyectoRepository.findAll();
        }
        return proyectoRepository.findByMiembrosContaining(usuario);
    }

    public Tarea CrearTareaenProyecto(int id_proyecto, Tarea nuevaTarea) throws Exception {

        Proyecto proyecto = proyectoRepository.findById(id_proyecto)
                .orElseThrow(() -> new Exception("Proyecto no encontrado"));
        nuevaTarea.setProyecto(proyecto);

        return tareaRepository.save(nuevaTarea);

    }

    public List<Tarea> listarMisTareasenProyecto(Long id_proyecto, Long idUsuario) {
        return tareaRepository.findByid_asignado(idUsuario).stream()
                .filter(tarea -> tarea.getProyecto().getId_proyecto() == id_proyecto)
                .collect(Collectors.toList());
    }
}