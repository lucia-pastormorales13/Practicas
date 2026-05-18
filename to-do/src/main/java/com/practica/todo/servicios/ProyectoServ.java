package com.practica.todo.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.ProyectoUsuarios;
import com.practica.todo.enumeration.*;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.ProyectoUsuariosrep;
import com.practica.todo.repositorios.Proyectorep;

@Service
public class ProyectoServ {

    @Autowired
    private Proyectorep proyectoRepository;

    @Autowired
    private ProyectoUsuariosrep proyectoUsuariosRepository;

    public Proyecto crearProyecto(Proyecto proyecto, Usuario gestor) {
        Proyecto savedProyecto = proyectoRepository.save(proyecto);

        ProyectoUsuarios proyectoUsuario = new ProyectoUsuarios();
        proyectoUsuario.setUsuario(gestor);
        proyectoUsuario.setProyecto(savedProyecto);
        proyectoUsuariosRepository.save(proyectoUsuario);

        return savedProyecto;
    }

    public List<Proyecto> ListarMisProyectos(Usuario usuario) {
        if (usuario.getRol() == Role.administrador) {
            return proyectoRepository.findAll();
        }
        return proyectoUsuariosRepository.findByUsuario_Id_usuario(usuario.getId_usuario())
                .stream()
                .map(ProyectoUsuarios::getProyecto)
                .toList();
    }

    public void eliminarProyecto(Integer id){
        if (proyectoRepository.existsById(id)){

            proyectoRepository.deleteById(id);

        }else{
            throw new RuntimeException("El proyecto con id: "+id+ " no existe.");
        }
    }

    public Proyecto getProyectoById(Integer id){
        return proyectoRepository.findById(id).orElse(null);
    }

    public Proyecto editarProyecto(Proyecto proyectoActual,Proyecto proyectoActualizado){
        if (proyectoActualizado.getNombre() != null && !proyectoActualizado.getNombre().isBlank()) {
            proyectoActual.setNombre(proyectoActualizado.getNombre());
        }
        if (proyectoActualizado.getDescripcion() != null && !proyectoActualizado.getDescripcion().isBlank()) {
            proyectoActual.setDescripcion(proyectoActualizado.getDescripcion());
        }
        if (proyectoActualizado.getEstado() != null && !proyectoActualizado.getEstado().isBlank()) {
            proyectoActual.setEstado(proyectoActualizado.getEstado());
        }
        if (proyectoActualizado.getFecha_inicio() != null) {
            proyectoActual.setFecha_inicio(proyectoActualizado.getFecha_inicio());
        }
        if (proyectoActualizado.getFecha_limite() != null) {
            proyectoActual.setFecha_limite(proyectoActualizado.getFecha_limite());
        }
        return proyectoRepository.save(proyectoActual);
    }
}  