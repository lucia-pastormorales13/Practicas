package com.practica.todo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.practica.todo.dto.IniciarRequest;
import com.practica.todo.dto.JwtResponse;
import com.practica.todo.dto.RegistrarRequest;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Usuariosrep;
import com.practica.todo.servicios.JwtService;
import com.practica.todo.servicios.UsuarioServ;

import lombok.*;

@RestController
@AllArgsConstructor
@CrossOrigin
@RequestMapping("/api/auth")
public class AuthController {
    private final Usuariosrep usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioServ usuarioServ;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/iniciar-sesion")
    public ResponseEntity<JwtResponse> iniciarSesion(@RequestBody IniciarRequest request) {
        return usuarioRepository.findByCorreo(request.getCorreo())
                .filter(usuario -> passwordEncoder.matches(request.getContrasenia(), usuario.getContrasenia()))
                .map(usuario -> {
                    String token = jwtService.generateToken(usuario.getCorreo());
                    if (usuario.getRol() == null) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new JwtResponse(token, "Rol no asignado", null, null, 0));
                    }
                    return ResponseEntity.ok(new JwtResponse(token, null, usuario.getRol(), usuario.getNombre(),
                            usuario.getId_usuario()));
                }).orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new JwtResponse(null, "Correo o contraseña incorrectos", null, null, 0)));
    }

    @PostMapping("/registrar")
    public ResponseEntity<JwtResponse> registrar(@RequestBody RegistrarRequest request) {
        Usuario u = new Usuario(request.getNombre(), request.getApellidos(), request.getCorreo(), request.getContrasenia());
        if (usuarioServ.registrarUsuario(u) == null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new JwtResponse(null, "Correo ya existente", null, null, 0));
        }
        return ResponseEntity.ok(new JwtResponse(null, null, null, null, 0));
    }

}