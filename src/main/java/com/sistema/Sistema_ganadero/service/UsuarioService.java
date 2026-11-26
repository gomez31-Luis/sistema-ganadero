package com.sistema.Sistema_ganadero.service;

import com.sistema.Sistema_ganadero.model.Usuario;
import com.sistema.Sistema_ganadero.model.PasswordResetToken;
import com.sistema.Sistema_ganadero.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UsuarioService {

    public boolean existeEmail(String email) {
        return usuarioRepository.findFirstByEmail(email).isPresent();
    }

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private RegistroPartoRepository partoRepository;

    @Autowired
    private RegistroReproductivoRepository reproductivoRepository;

    @Autowired
    private ToroCompraRepository toroRepository;

    @Autowired
    private EmailService emailService;

    public String crearTokenRecuperacion(String email) {
        return usuarioRepository.findFirstByEmail(email).map(usuario -> {
            // Borrar tokens anteriores del mismo usuario
            tokenRepository.deleteByUsuarioId(usuario.getId());
            
            // Crear nuevo token
            String token = UUID.randomUUID().toString();
            PasswordResetToken myToken = new PasswordResetToken(token, usuario);
            tokenRepository.save(myToken);
            return token;
        }).orElse(null);
    }

    public boolean validarTokenYCambiarPassword(String token, String nuevaPassword) {
        java.util.Optional<PasswordResetToken> passToken = tokenRepository.findByToken(token);
        if (passToken.isPresent() && !passToken.get().estaExpirado()) {
            Usuario usuario = passToken.get().getUsuario();
            usuario.setPassword(passwordEncoder.encode(nuevaPassword));
            usuarioRepository.save(usuario);
            tokenRepository.delete(passToken.get());
            return true;
        }
        return false;
    }

    /**
     * Este método recibe un usuario con contraseña plana (ej: "123")
     * y lo guarda en la base de datos con la contraseña protegida.
     */
    public Usuario registrarUsuario(Usuario usuario) {
        // 1. Encriptamos la contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        
        // 2. Le pedimos al repositorio que lo guarde en MongoDB
        return usuarioRepository.save(usuario);
    }

    public java.util.List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public void eliminarUsuario(String id) {
        usuarioRepository.deleteById(id);
    }

    /**
     * Devuelve los datos del usuario actualmente logueado.
     */
    public java.util.Optional<Usuario> getUsuarioActual(String username) {
        return usuarioRepository.findFirstByUsername(username);
    }

    /**
     * Actualiza el perfil del usuario logueado.
     * Si cambia el username, reasigna todos sus registros al nuevo nombre.
     * Si se envía nueva contraseña, la encripta antes de guardar.
     */
    public boolean actualizarPerfil(String usernameActual, String nuevoUsername, String nombreCompleto, String email, String nuevaPassword) {
        java.util.Optional<Usuario> optUsuario = usuarioRepository.findFirstByUsername(usernameActual);
        if (optUsuario.isEmpty()) return false;

        Usuario usuario = optUsuario.get();
        boolean cambioUsername = !usernameActual.equals(nuevoUsername);

        usuario.setNombreCompleto(nombreCompleto);
        usuario.setEmail(email);
        if (nuevoUsername != null && !nuevoUsername.isBlank()) {
            usuario.setUsername(nuevoUsername);
        }
        if (nuevaPassword != null && !nuevaPassword.isBlank()) {
            usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        }
        usuarioRepository.save(usuario);

        // Si cambió el username, actualizar el propietario en todos los registros
        if (cambioUsername) {
            migrarPropietario(usernameActual, nuevoUsername);
        }
        return cambioUsername; // retorna true si hubo cambio de username (para forzar re-login)
    }

    private void migrarPropietario(String usernameViejo, String usernameNuevo) {
        animalRepository.findByPropietario(usernameViejo).forEach(a -> {
            a.setPropietario(usernameNuevo);
            animalRepository.save(a);
        });
        partoRepository.findByPropietario(usernameViejo).forEach(p -> {
            p.setPropietario(usernameNuevo);
            partoRepository.save(p);
        });
        reproductivoRepository.findByPropietario(usernameViejo).forEach(r -> {
            r.setPropietario(usernameNuevo);
            reproductivoRepository.save(r);
        });
        toroRepository.findByPropietario(usernameViejo).forEach(t -> {
            t.setPropietario(usernameNuevo);
            toroRepository.save(t);
        });
    }
}

