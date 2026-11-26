package com.sistema.Sistema_ganadero.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Clase de configuración de seguridad de Spring Security.
 * Aquí se definen quiénes pueden entrar a qué páginas y cómo se maneja el login.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.security.remember-me-key}")
    private String rememberMeKey;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CONFIGURACIÓN DE AUTORIZACIONES (¿Quién puede entrar?)
            .authorizeHttpRequests(auth -> auth
                // Estas rutas son públicas: Inicio, Registro, recuperación y archivos estáticos
                .requestMatchers("/", "/index.html", "/registrar", "/css/**", "/js/**", "/img/**", "/restablecer-password.html").permitAll()
                .requestMatchers("/api/olvido-password", "/api/restablecer-password", "/api/verificar-email").permitAll()
                // Cualquier otra ruta REQUIERE login
                .anyRequest().authenticated()
            )

            // 2. CONFIGURACIÓN DEL LOGIN (¿Cómo se entra?)
            .formLogin(login -> login
                .loginPage("/index.html")           // Indica dónde está nuestro formulario de login
                .loginProcessingUrl("/login")       // La URL interna que procesa el POST del formulario
                .defaultSuccessUrl("/menu.html", true) // Si el login es correcto, nos manda al menú principal
                .permitAll()                        // Permite que todos vean la página de login
            )

            // 3. CONFIGURACIÓN DEL LOGOUT (¿Cómo se sale?)
            .logout(logout -> logout
                .logoutUrl("/logout")               // La URL para cerrar sesión
                .logoutSuccessUrl("/index.html")    // Al salir, nos manda de vuelta al inicio
                .permitAll()
            )

            // 4. RECORDARME (Cookie que mantiene la sesión por 30 días)
            .rememberMe(remember -> remember
                .rememberMeParameter("remember-me")  // Nombre del checkbox en el formulario
                .tokenValiditySeconds(30 * 24 * 60 * 60) // 30 días en segundos
                .key(rememberMeKey)  // Clave para firmar la cookie desde configuración/entorno
            )

            // 5. DESACTIVAR CSRF (Solo por desarrollo)
            // Se desactiva para facilitar las pruebas con los formularios POST
            .csrf(csrf -> csrf.disable());

        return http.build();
    }

    /**
     * Define el algoritmo de encriptación para las contraseñas.
     * BCrypt es un estándar de la industria que convierte "1234" en algo como "$2a$10$..."
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

