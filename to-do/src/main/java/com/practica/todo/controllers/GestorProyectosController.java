package com.practica.todo.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.practica.todo.dto.JwtResponse;
import com.practica.todo.entidades.Proyecto;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Usuariosrep;
import com.practica.todo.servicios.ProyectoServ;
import com.practica.todo.servicios.UsuarioServ;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/gestor")
@CrossOrigin
public class GestorProyectosController {
    private final ProyectoServ proyectoServices;
    private final Usuariosrep usuariosrepositorio;
    private final UsuarioServ usuarioServ;

    @PostMapping("/crear/{id_gestor}")
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?> crearProyecto(
            @RequestBody Map<String, Object> body,
            @PathVariable Integer id_gestor) {

        try {
            Usuario gestor = usuariosrepositorio.findById(id_gestor)
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            Proyecto proyecto = new Proyecto();
            proyecto.setNombre((String) body.get("nombre"));
            proyecto.setDescripcion((String) body.get("descripcion"));
            proyecto.setEstado((String) body.get("estado"));
            proyecto.setFecha_inicio(LocalDate.parse((String) body.get("fecha_inicio")));
            proyecto.setFecha_limite(LocalDate.parse((String) body.get("fecha_limite")));

            List<Integer> miembros = ((List<?>) body.get("miembros"))
                    .stream()
                    .map(id -> Integer.parseInt(id.toString()))
                    .toList();

            Proyecto nuevo = proyectoServices.crearProyecto(proyecto, gestor, miembros);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?> eliminarProyecto(@PathVariable Integer id) {
        try {
            proyectoServices.eliminarProyecto(id);
            return new ResponseEntity<>("El proyecto con id: " + id + " ha sido eliminado.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("No se encontró el proyecto", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/editar/{id_proyecto}")
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?> editarProyecto(@PathVariable Integer id_proyecto,
            @RequestBody Proyecto proyectoActualizado) {
        try {
            Proyecto proyectoExistente = proyectoServices.getProyectoById(id_proyecto);
            if (proyectoExistente != null) {
                proyectoActualizado.setId_proyecto(id_proyecto);
                Proyecto proyectoEditado = proyectoServices.editarProyecto(proyectoExistente, proyectoActualizado);
                return new ResponseEntity<>(proyectoEditado, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No se encontró el proyecto", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/listar-usuarios-gestor")
    @PreAuthorize("hasAuthority('gestor_proyectos')")
    public ResponseEntity<?> listarUsuariosGestor() {
        List<Usuario> usuarios = usuarioServ.getAllUsuarios();
        if (usuarios == null || usuarios.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JwtResponse(null, "No se encontraron usuarios", null, null, 0));
        }
        return ResponseEntity.ok(usuarios);
    }
}
