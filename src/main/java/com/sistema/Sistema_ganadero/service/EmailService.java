package com.sistema.Sistema_ganadero.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void enviarCorreoRecuperacion(String toEmail, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Recuperación de Contraseña - Rancho La Bendición");
        message.setText("Has solicitado restablecer tu contraseña.\n\n" +
                "Para hacerlo, haz clic en el siguiente enlace:\n" + link + "\n\n" +
                "Este enlace expirará en 1 hora.\n" +
                "Si no solicitaste este cambio, puedes ignorar este correo.");
        
        mailSender.send(message);
    }
}
