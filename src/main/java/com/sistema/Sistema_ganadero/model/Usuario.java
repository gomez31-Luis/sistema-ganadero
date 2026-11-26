package com.sistema.Sistema_ganadero.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Esta clase representa la "Tabla" (Colección) en MongoDB.
 * Define qué datos vamos a guardar de cada Administrador.
 */
@Data
@Document(collection = "usuarios") // Le dice a MongoDB que guarde esto en una colección llamada "usuarios"
public class Usuario {
    @Id // Marca este campo como la llave única (ID) en la base de datos
    private String id;
    private String nombreCompleto;

    @Indexed(unique = true) // No permite correos duplicados
    private String email;

    @Indexed(unique = true) // No permite nombres de usuario duplicados
    private String username;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password; // Aquí se guardará la contraseña ya encriptada
}

