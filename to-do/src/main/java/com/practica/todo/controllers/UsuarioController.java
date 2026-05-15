package com.practica.todo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//mport com.practica.todo.dto.IniciarRequest;
import com.practica.todo.dto.JwtResponse;
import com.practica.todo.dto.UsuarioRequest;
import com.practica.todo.entidades.Usuario;
//import com.practica.todo.servicios.JwtService;
import com.practica.todo.servicios.UsuarioServ;

@RestController
@RequestMapping("/apo/admin")
public class UsuarioController {
    @Autowired
    private UsuarioServ usuarioServ;

    @PostMapping("/crear-usuario")
    public ResponseEntity<JwtResponse> crearUsuario(@RequestBody UsuarioRequest request){
        Usuario u = new Usuario(request.getNombre(), request.getApellidos(), request.getCorreo(), request.getContrasenia(), request.getRol());
        if (usuarioServ.registrarUsuario(u) == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new JwtResponse(null, "Correo ya existente", null, null, 0));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(null, "Usuario creado exitosamente", null, null, 0));
    }

    @PostMapping("/listar-usuarios")
    public ResponseEntity<?> listarUsuario(){
        if (usuarioServ.getAllUsuarios() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new JwtResponse(null, "No se encontraron usuarios", null, null, 0));
        }
        return ResponseEntity.ok(usuarioServ.getAllUsuarios());
    }

    //@PostMapping("/editar-usuario/{id-usuario}")
    //public ResponseEntity<JwtResponse> editarUsuario(@PathVariable)
}