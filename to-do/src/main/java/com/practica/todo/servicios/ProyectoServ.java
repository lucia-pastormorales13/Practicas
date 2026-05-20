package com.practica.todo.servicios;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.ProyectoUsuarios;
import com.practica.todo.enumeration.*;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.*;

@Service
public class ProyectoServ {

    @Autowired
    private Proyectorep proyectoRepository;

    @Autowired
    private ProyectoUsuariosrep proyectoUsuariosRepository;

    @Autowired
    private Usuariosrep usuariosRepository;

    public Proyecto crearProyecto(Proyecto proyecto, Usuario gestor, List<Integer> usuariosIds) {

        Proyecto savedProyecto = proyectoRepository.save(proyecto);

        // always assign gestor too
        ProyectoUsuarios gestorRel = new ProyectoUsuarios();
        gestorRel.setUsuario(gestor);
        gestorRel.setProyecto(savedProyecto);
        proyectoUsuariosRepository.save(gestorRel);

        // assign other users
        for (Integer idUsuario : usuariosIds) {

            // skip if it's the gestor (optional safety)
            if (idUsuario.equals(gestor.getId_usuario()))
                continue;

            ProyectoUsuarios pu = new ProyectoUsuarios(); // IMPORTANT: new object each time

            Usuario usuario = usuariosRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuario));

            pu.setUsuario(usuario);
            pu.setProyecto(savedProyecto);

            proyectoUsuariosRepository.save(pu);
        }

        return savedProyecto;
    }

    public List<Proyecto> ListarMisProyectos(Usuario usuario) {

        List<Proyecto> proyectos;

        if (usuario.getRol() == Role.administrador) {
            proyectos = proyectoRepository.findAll();
        } else {
            proyectos = proyectoUsuariosRepository
                    .findByUsuario_Id_usuario(usuario.getId_usuario())
                    .stream()
                    .map(ProyectoUsuarios::getProyecto)
                    .distinct()
                    .toList();
        }

        return proyectos;
    }

    public int countMiembros(Integer idProyecto) {
        return proyectoUsuariosRepository
                .findByProyecto_Id_proyecto(idProyecto)
                .size();
    }

    public void eliminarProyecto(Integer id) {
        if (proyectoRepository.existsById(id)) {

            proyectoRepository.deleteById(id);

        } else {
            throw new RuntimeException("El proyecto con id: " + id + " no existe.");
        }
    }

    public Proyecto getProyectoById(Integer id) {
        return proyectoRepository.findById(id).orElse(null);
    }

    public Proyecto editarProyecto(Proyecto proyectoActual, Proyecto proyectoActualizado) {
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