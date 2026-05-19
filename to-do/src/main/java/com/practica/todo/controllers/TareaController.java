package com.practica.todo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practica.todo.entidades.Tarea;
import com.practica.todo.repositorios.Usuariosrep;
import com.practica.todo.servicios.TareaServ;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")

class TareaController {

    @Autowired
    private TareaServ tareaServ;

    @PostMapping("/crear")
    public ResponseEntity<?> editarTarea(@RequestBody Tarea tarea){
        try{
            Tarea TareaActualizada= tareaServ.editarTarea(tarea);
            return ResponseEntity.ok(TareaActualizada);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al editar: "+ e.getMessage());
        }

    }

    @PostMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarTarea(@PathVariable int id) {
        try {
            tareaServ.eliminarTarea(id);
            return ResponseEntity.ok("La tarea con ID: " + id + " ha sido eliminada corectamente.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la tarea");
        }
    }

    @PostMapping("/editar/{id}")
    public ResponseEntity<?> editartarea(@RequestBody Tarea tarea){
        try{
            if(tarea.getId_tarea()== 0){
                ResponseEntity.badRequest().body("Error, se debe proporcionar el ID de la tarea para poder editarlo.");

            }
            Tarea TareaActualizada= tareaServ.editarTarea(tarea);
            return ResponseEntity.ok(TareaActualizada);
        }catch (Exception e){
            return ResponseEntity.status((HttpStatus.INTERNAL_SERVER_ERROR)).body("Error al actualizar la tarea: "+ e.getMessage());
        }
    }

    @PostMapping ("/actualizar-estado/{id}")
    public ResponseEntity<?> actestado(@PathVariable int id, @RequestBody Tarea nuevoEstado){
        try{
            Tarea tarea= tareaServ.buscarporId(id);
            tarea.setEstado(nuevoEstado.getEstado());
            tareaServ.editarTarea(tarea);

            return ResponseEntity.ok("Estado actualizado correctamente a: "+nuevoEstado);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La tarea no ha sido encontrada");

        }
    }

    @Autowired
    private Usuariosrep usuariosrepositorio;

    // Obtener las tareas de un usuario en un proyecto (solo a las que pertenecen)
    @PostMapping("/listar-tareas/{id_usuario}/{id_proyecto}")
    public ResponseEntity<List<Tarea>> getTareasByUsuarioYProyecto( @PathVariable Integer id_usuario,  @PathVariable Integer id_proyecto) {

        return usuariosrepositorio.findById(id_usuario).map(usuario -> {
            try {
                List<Tarea> tareas = tareaServ.listarTareasDeUsuarioEnProyecto(usuario.getId_usuario(), id_proyecto);
                return new ResponseEntity<>(tareas, HttpStatus.OK);

            } catch (Exception e) {
                return new ResponseEntity<List<Tarea>>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));

    }

}
/*
 * -crear tareas
 * -eliminar tareas
 * -editar tareas
 */