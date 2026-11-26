package com.sistema.Sistema_ganadero.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Modelo para almacenar tokens de recuperación de contraseña.
 * Cada token está asociado a un usuario y tiene una fecha de expiración.
 */
@Data
@Document(collection = "tokens_recuperacion")
public class PasswordResetToken {

    @Id
    private String id;
    
    private String token;
    
    @DBRef
    private Usuario usuario;
    
    private LocalDateTime fechaExpiracion;

    public PasswordResetToken() {}

    public PasswordResetToken(String token, Usuario usuario) {
        this.token = token;
        this.usuario = usuario;
        this.fechaExpiracion = LocalDateTime.now().plusHours(1); // El token dura 1 hora
    }

    public boolean estaExpirado() {
        return LocalDateTime.now().isAfter(this.fechaExpiracion);
    }
}
