package com.practica.todo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practica.todo.entidades.*;
import com.practica.todo.servicios.TareaServ;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*")

class TareaController {

    @Autowired
    private TareaServ tareaServ;

    @PostMapping("/crear/{id_proyecto}")
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

    @PostMapping("/editar")
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

}
/*
 * -crear tareas
 * -eliminar tareas
 * -editar tareas
 */