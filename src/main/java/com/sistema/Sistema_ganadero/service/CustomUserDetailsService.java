package com.sistema.Sistema_ganadero.service;

import com.sistema.Sistema_ganadero.model.Usuario;
import com.sistema.Sistema_ganadero.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Esta es una clase especial requerida por Spring Security.
 * Su único trabajo es decirle a Spring si un usuario existe en MongoDB cuando intenta hacer Login.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Buscamos al usuario en nuestra colección de MongoDB
        Usuario usuario = usuarioRepository.findFirstByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Retornamos un objeto "User" que Spring Security entiende
        return new User(usuario.getUsername(), usuario.getPassword(), new ArrayList<>());
    }
}

