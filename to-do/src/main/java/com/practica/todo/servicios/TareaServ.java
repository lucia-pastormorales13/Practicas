package com.practica.todo.servicios;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.Tarea;
import com.practica.todo.repositorios.Proyectorep;
import com.practica.todo.repositorios.Tareasrep;

@Service
public class TareaServ {
    @Autowired
    private Tareasrep tareaRepository;

    @Autowired
    private Proyectorep proyectoRepository;
    
    public Tarea crearTarea(int id_proyecto, Tarea nuevaTarea) throws Exception{

        Proyecto proyecto= proyectoRepository.findById(id_proyecto).orElseThrow(( )-> new Exception("Proyecto no encontrado"));
        nuevaTarea.setProyecto(proyecto);
        
        return tareaRepository.save(nuevaTarea);
        
    }

    public List <Tarea> listarTareasDeUsuarioEnProyecto (Long id_proyecto, Long idUsuario){
        return tareaRepository.findByid_asignado(idUsuario).stream()
            .filter(tarea -> tarea.getProyecto().getId_proyecto() == id_proyecto)
            .collect(Collectors.toList());
    }

    public Tarea editarTarea(Tarea tarea){
        return tareaRepository.save(tarea);
    }
}