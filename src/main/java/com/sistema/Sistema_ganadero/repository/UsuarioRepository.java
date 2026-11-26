package com.sistema.Sistema_ganadero.repository;

import com.sistema.Sistema_ganadero.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

/**
 * El Repositorio es el puente entre Java y la Base de Datos.
 * Gracias a MongoRepository, no tenemos que escribir código para Guardar, Editar o Borrar.
 */
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    
    // Spring Boot crea automáticamente la lógica para buscar un usuario por su nombre
    Optional<Usuario> findFirstByUsername(String username);
    
    // Buscar por correo para recuperación de contraseña (findFirst evita errores si hay duplicados viejos)
    Optional<Usuario> findFirstByEmail(String email);
}

