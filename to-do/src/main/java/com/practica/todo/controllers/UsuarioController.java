package com.practica.todo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.practica.todo.dto.JwtResponse;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.servicios.UsuarioServ;

@RestController
@RequestMapping("/api/admin")
public class UsuarioController {
    @Autowired
    private UsuarioServ usuarioServ;

    @PostMapping("/crear-usuario")
    @PreAuthorize("hasAuthority('administrador')")
    public ResponseEntity<JwtResponse> crearUsuario(@RequestBody Usuario usuario) {
        Usuario u = new Usuario(usuario.getNombre(), usuario.getApellidos(), usuario.getCorreo(),
                usuario.getContrasenia(), usuario.getRol());
        if (usuarioServ.crearUsuario(u) == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new JwtResponse(null, "Correo ya existente", null, null, 0));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new JwtResponse(null, "Usuario creado exitosamente", null, null, 0));
    }

    @GetMapping("/listar-usuarios")
    @PreAuthorize("hasAuthority('administrador')")
    public ResponseEntity<?> listarUsuario() {
        if (usuarioServ.getAllUsuarios() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JwtResponse(null, "No se encontraron usuarios", null, null, 0));
        }
        return ResponseEntity.ok(usuarioServ.getAllUsuarios());
    }

    @GetMapping("/get-usuario/{id-usuario}")
    @PreAuthorize("hasAuthority('administrador')")
    public ResponseEntity<JwtResponse> getUsuario(@PathVariable("id-usuario") int id_usuario) {
        Usuario u = usuarioServ.getUsuarioConId(id_usuario);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JwtResponse(null, "Usuario no encontrado", null, null, 0));
        }
        return ResponseEntity.ok(new JwtResponse(null, "Usuario encontrado", null, null, 0));
    }

    @PutMapping("/editar-usuario/{id-usuario}")
    @PreAuthorize("hasAuthority('administrador')")
    public ResponseEntity<JwtResponse> editarUsuario(@RequestBody Usuario usuario,
            @PathVariable("id-usuario") int id_usuario) {
        Usuario u = usuarioServ.getUsuarioConId(id_usuario);
        if (u == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JwtResponse(null, "Usuario no encontrado", null, null, 0));
        }
        usuario.setId_usuario(id_usuario);
        usuarioServ.editarUsuario(usuario);
        return ResponseEntity.ok(new JwtResponse(null, "Usuario editado exitosamente", null, null, 0));
    }

    @DeleteMapping("/borrar-usuario/{id-usuario}")
    @PreAuthorize("hasAuthority('administrador')")
    public ResponseEntity<JwtResponse> borrarUsuario(@PathVariable("id-usuario") int id_usuario) {
        if (usuarioServ.getUsuarioConId(id_usuario) == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new JwtResponse(null, "Usuario no encontrado", null, null, id_usuario));
        }
        usuarioServ.borrarUsuario(id_usuario);
        return ResponseEntity.ok(new JwtResponse(null, "Usuario eliminado exitosamente", null, null, id_usuario));
    }
}