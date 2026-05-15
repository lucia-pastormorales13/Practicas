package com.practica.todo.servicios;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.practica.todo.enumeration.*;
import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Usuariosrep;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServ {
    private final Usuariosrep UsuarioRep;
    private final PasswordEncoder passwordEncoder;

    //------ADMINISTRADOR------
    public Usuario crearUsuario(Usuario usuario){
        if (UsuarioRep.findByCorreo(usuario.getCorreo()).isPresent()) {
            return null;
        }

        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));
        return UsuarioRep.save(usuario);
    }

    @PreAuthorize("hasAuthority('administrador')")
    public Usuario editarUsuario(Usuario usuario){
        return UsuarioRep.save(usuario);
    }

    @PreAuthorize("hasAuthority('administrador')")
    public Usuario getUsuarioConId(int id){
        return UsuarioRep.findById(id).orElse(null);
    }

    @PreAuthorize("hasAuthority('administrador')")
    public List<Usuario> getAllUsuarios(){
        return UsuarioRep.findAll();
    }

    @PreAuthorize("hasAuthority('administrador')")
    public void borrarUsuario(int id){
        UsuarioRep.deleteById(id);
    }

    public Usuario registrarUsuario(Usuario usuario){
        if (UsuarioRep.findByCorreo(usuario.getCorreo()).isPresent()) {
            return null;
        }

        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));
        usuario.setRol(Role.colaborador);
        return UsuarioRep.save(usuario);
    }
}
