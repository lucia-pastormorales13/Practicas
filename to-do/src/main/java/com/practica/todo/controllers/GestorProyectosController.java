package com.practica.todo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Usuariosrep;
import com.practica.todo.servicios.ProyectoServ;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/gestor")
@CrossOrigin(origins = "*")
public class GestorProyectosController {
    private final ProyectoServ proyectoServices;
    private final Usuariosrep usuariosrepositorio;

    // crear proyecto
    @PostMapping("/crear/{id_gestor}")    
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?> crear(@RequestBody Proyecto proyecto, @PathVariable Integer id_gestor) {
        try {
            Usuario gestor = usuariosrepositorio.findById(id_gestor)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            Proyecto nuevo = proyectoServices.crearProyecto(proyecto, gestor);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }

    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?>eliminar(@PathVariable Integer id){
        try{
            proyectoServices.eliminarProyecto(id);
            return new ResponseEntity<>("El proyecto con id: "+id+" ha sido eliminado.", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("No se encontró el proyecto", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/editar/{id_proyecto}")
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?> editar(@PathVariable Integer id_proyecto, @RequestBody Proyecto proyectoActualizado){
        try{
            Proyecto proyectoExistente = proyectoServices.getProyectoById(id_proyecto);
            if(proyectoExistente != null){
                proyectoActualizado.setId_proyecto(id_proyecto);
                Proyecto proyectoEditado = proyectoServices.editarProyecto(proyectoExistente, proyectoActualizado);
                return new ResponseEntity<>(proyectoEditado, HttpStatus.OK);
            }else{
                return new ResponseEntity<>("No se encontró el proyecto", HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
