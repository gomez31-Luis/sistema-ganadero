package com.sistema.Sistema_ganadero.controller;

import com.sistema.Sistema_ganadero.service.UsuarioService;
import com.sistema.Sistema_ganadero.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PasswordResetController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/verificar-email")
    public ResponseEntity<Boolean> verificarEmail(@RequestParam String email) {
        boolean existe = usuarioService.existeEmail(email);
        return ResponseEntity.ok(existe);
    }

    @PostMapping("/olvido-password")
    public ResponseEntity<?> solicitarRecuperacion(@RequestParam String email, jakarta.servlet.http.HttpServletRequest request) {
        String token = usuarioService.crearTokenRecuperacion(email);
        if (token != null) {
            try {
                // Obtener la IP o dominio real (así si lo abren en celular, usa la IP de la red local)
                String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
                String link = baseUrl + "/restablecer-password.html?token=" + token;
                emailService.enviarCorreoRecuperacion(email, link);
                return ResponseEntity.ok("Enlace de recuperación enviado al correo.");
            } catch (Exception e) {
                System.err.println("Error al enviar correo: " + e.getMessage());
                return ResponseEntity.internalServerError().body("Error al enviar el correo. Verifique la configuración del servidor SMTP.");
            }
        }
        return ResponseEntity.badRequest().body("El correo ingresado no está registrado.");
    }

    @PostMapping("/restablecer-password")
    public ResponseEntity<?> restablecerPassword(@RequestParam String token, @RequestParam String nuevaPassword) {
        boolean exito = usuarioService.validarTokenYCambiarPassword(token, nuevaPassword);
        if (exito) {
            return ResponseEntity.ok("Contraseña actualizada con éxito.");
        }
        return ResponseEntity.badRequest().body("El token es inválido o ha expirado.");
    }
}
