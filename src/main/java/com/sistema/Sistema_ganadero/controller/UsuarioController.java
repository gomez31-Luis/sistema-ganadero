package com.sistema.Sistema_ganadero.controller;

import com.sistema.Sistema_ganadero.model.Usuario;
import com.sistema.Sistema_ganadero.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * El Controlador es la "Puerta de Entrada".
 * Recibe las peticiones que vienen desde los formularios HTML en el navegador.
 */
@Controller
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService; // Conectamos con el servicio

    /**
     * Este método se activa cuando alguien envía el formulario de registro.
     * Recibe los datos, los manda al servicio y luego redirige al inicio.
     */
    @PostMapping("/registrar")
    public String registrar(@ModelAttribute Usuario usuario) {
        // Le pasamos el usuario al servicio para que lo procese y guarde
        usuarioService.registrarUsuario(usuario);

        // Redirigimos al index con un mensaje de éxito en la URL
        return "redirect:/index.html?registrado=true";
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/usuarios/todos")
    @org.springframework.web.bind.annotation.ResponseBody
    public java.util.List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/usuarios/eliminar/{id}")
    @org.springframework.web.bind.annotation.ResponseBody
    public org.springframework.http.ResponseEntity<String> eliminarUsuario(
            @org.springframework.web.bind.annotation.PathVariable String id) {
        usuarioService.eliminarUsuario(id);
        return org.springframework.http.ResponseEntity.ok("Usuario eliminado");
    }

    @org.springframework.web.bind.annotation.GetMapping("/api/perfil")
    @org.springframework.web.bind.annotation.ResponseBody
    public org.springframework.http.ResponseEntity<?> getPerfil(java.security.Principal principal) {
        if (principal == null)
            return org.springframework.http.ResponseEntity.status(401).build();
        return usuarioService.getUsuarioActual(principal.getName())
                .map(u -> {
                    java.util.Map<String, String> datos = new java.util.HashMap<>();
                    datos.put("username", u.getUsername());
                    datos.put("nombreCompleto", u.getNombreCompleto() != null ? u.getNombreCompleto() : "");
                    datos.put("email", u.getEmail() != null ? u.getEmail() : "");
                    return org.springframework.http.ResponseEntity.ok(datos);
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }

    @org.springframework.web.bind.annotation.PostMapping("/api/perfil/actualizar")
    @org.springframework.web.bind.annotation.ResponseBody
    public org.springframework.http.ResponseEntity<java.util.Map<String, Object>> actualizarPerfil(
            java.security.Principal principal,
            @org.springframework.web.bind.annotation.RequestParam String nuevoUsername,
            @org.springframework.web.bind.annotation.RequestParam String nombreCompleto,
            @org.springframework.web.bind.annotation.RequestParam String email,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String nuevaPassword) {
        if (principal == null)
            return org.springframework.http.ResponseEntity.status(401).build();
        boolean cambioUsername = usuarioService.actualizarPerfil(
                principal.getName(), nuevoUsername, nombreCompleto, email, nuevaPassword);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("ok", true);
        result.put("relogin", cambioUsername);
        return org.springframework.http.ResponseEntity.ok(result);
    }
}
