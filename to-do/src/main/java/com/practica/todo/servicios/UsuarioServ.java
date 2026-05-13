package com.practica.todo.servicios;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Role;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Usuariosrep;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServ {
    private final Usuariosrep UsuarioRep;
    private final PasswordEncoder passwordEncoder;

    //------ADMINISTRADOR------

    @PreAuthorize("hasRole('administrador')")
    public Usuario crearUsuario(Usuario usuario){
        if (UsuarioRep.findByEmail(usuario.getCorreo()).isPresent()) {
            return null;
        }

        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));
        return UsuarioRep.save(usuario);
    }

    @PreAuthorize("hasRole('administrador')")
    public Usuario editarUsuario(Usuario usuario){
        return UsuarioRep.save(usuario);
    }

    @PreAuthorize("hasRole('administrador')")
    public Usuario getUsuarioConId(int id){
        return UsuarioRep.findById(id).orElse(null);
    }

    @PreAuthorize("hasRole('administrador')")
    public List<Usuario> getAllUsuarios(){
        return UsuarioRep.findAll();
    }

    @PreAuthorize("hasRole('administrador')")
    public void borrarUsuario(int id){
        UsuarioRep.deleteById(id);
    }

    public Usuario registrarUsuario(Usuario usuario){
        if (UsuarioRep.findByEmail(usuario.getCorreo()).isPresent()) {
            return null;
        }

        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));
        usuario.setRol(Role.colaborador);
        return UsuarioRep.save(usuario);
    }
}
