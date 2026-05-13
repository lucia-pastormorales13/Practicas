package com.practica.todo.servicios;


import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.practica.todo.entidades.Usuario;
import com.practica.todo.repositorios.Usuariosrep;

@Service
public class UsuarioServ {
    private final Usuariosrep UsuarioRep;

    public UsuarioServ(Usuariosrep usuarioRep) {
        this.UsuarioRep = usuarioRep;
    }

    @PreAuthorize("hasRole('administrador')")
    public Usuario crearUsuario(Usuario usuario){
        return UsuarioRep.save(usuario);
    }

    @PreAuthorize("hasRole('administrador')")
    public Usuario editUsuario(Usuario usuario){
        return UsuarioRep.save(usuario);
    }
}
