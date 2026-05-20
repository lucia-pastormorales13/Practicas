package com.practica.todo.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.ProyectoUsuarios;
import com.practica.todo.entidades.Tarea;
import com.practica.todo.repositorios.ProyectoUsuariosrep;
import com.practica.todo.repositorios.Proyectorep;
import com.practica.todo.repositorios.Tareasrep;

@Service
public class TareaServ {
    @Autowired
    private Tareasrep tareaRepository;

    @Autowired
    private Proyectorep proyectoRepository;

    @Autowired
    private ProyectoUsuariosrep proyectoUsuariosRep;
    
    public Tarea crearTarea(int id_proyecto, Tarea nuevaTarea) throws Exception{

        Proyecto proyecto= proyectoRepository.findById(id_proyecto).orElseThrow(( )-> new Exception("Proyecto no encontrado"));
        nuevaTarea.setProyecto(proyecto);
        
        return tareaRepository.save(nuevaTarea);
        
    }

    public List<Tarea> listarTareasDeUsuarioEnProyecto(int id_usuario, int id_proyecto) throws Exception {
        Proyecto proyectoAsignado = proyectoUsuariosRep.findByUsuario_Id_usuario(id_usuario).stream()
            .map(ProyectoUsuarios::getProyecto)
            .filter(p -> p.getId_proyecto() == id_proyecto)
            .findFirst()
            .orElse(null);

        if (proyectoAsignado == null) {
            return List.of();
        }

        Proyecto proyecto = proyectoRepository.findById(id_proyecto)
            .orElseThrow(() -> new Exception("Proyecto no encontrado"));

        return tareaRepository.findByProyecto(proyecto);
    }

    public Tarea editarTarea(Tarea tarea){
        return tareaRepository.save(tarea);
    }

    public void eliminarTarea(int id_tarea) throws Exception{
        if (!tareaRepository.existsById(id_tarea)){
            throw new Exception("La tarea no existe.");

        }
        tareaRepository.deleteById(id_tarea);

    }

    public Tarea buscarporId(int id_tarea) throws Exception{
        return tareaRepository.findById(id_tarea).orElseThrow(()-> new Exception("Tarea no encobtrada"));
    }
}