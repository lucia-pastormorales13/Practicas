package com.practica.todo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.practica.todo.entidades.Usuario;
import com.practica.todo.enumeration.Role;
import com.practica.todo.repositorios.Usuariosrep;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdmin(Usuariosrep usuarioRepository,
                                PasswordEncoder passwordEncoder) {

        return args -> {

            String adminCorreo = "admin@gmail.com";

            // check if admin already exists
            if (usuarioRepository.findByCorreo(adminCorreo).isEmpty()) {

                Usuario admin = new Usuario();
                admin.setNombre("Admin");
                admin.setApellidos("System");
                admin.setCorreo(adminCorreo);

                // VERY IMPORTANT -> encode password
                admin.setContrasenia(passwordEncoder.encode("admin123"));

                admin.setRol(Role.administrador);

                usuarioRepository.save(admin);

                System.out.println("ADMIN CREATED");
            } else {
                System.out.println("ADMIN ALREADY EXISTS");
            }
        };
    }
}