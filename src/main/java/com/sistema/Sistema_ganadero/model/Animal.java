package com.sistema.Sistema_ganadero.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

/**
 * Representa un animal en el hato.
 * Se guarda en la colección "animales" de MongoDB.
 */
@Data
@Document(collection = "animales")
public class Animal {
    @Id
    private String id;
    private String propietario;   // Dueño del registro (multi-tenant)
    private String carabana;      // ID visual o caravana
    private String nombre;
    private String raza;
    private LocalDate nacimiento;
    private String nombreMadre;
    private String nombrePadre;
    private String sexo;
    private String estado;        // activa, vendida, etc.
    private String fotoUrl;       // Ruta o nombre de la imagen cargada
}
