package com.practica.todo.controllers;

import java.util.List;
//import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.practica.todo.repositorios.Proyectorep;
import com.practica.todo.repositorios.Usuariosrep;
import com.practica.todo.servicios.*;
import com.practica.todo.entidades.*;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")

public class ProyectoController {
    private final ProyectoServ proyectoServices;
    private final Usuariosrep usuariosrepositorio;

    @GetMapping("/listar-proyectos/{id_usuario}")
    public ResponseEntity<?> getProyectoByUsuario(@PathVariable Integer id_usuario) {

        return usuariosrepositorio.findById(id_usuario)
                .map(usuario -> {
                    List<Proyecto> proyectos =
                            proyectoServices.ListarMisProyectos(usuario);
                    return ResponseEntity.ok(proyectos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/miembros/{idProyecto}")
    public ResponseEntity<Integer> countMiembros(@PathVariable Integer idProyecto) {
        return ResponseEntity.ok(proyectoServices.countMiembros(idProyecto));
    }
}
