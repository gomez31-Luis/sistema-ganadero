package com.sistema.Sistema_ganadero.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

/**
 * Representa el registro del parto de una vaca.
 * Se guarda en la colección "registros_partos".
 */
@Data
@Document(collection = "registros_partos")
public class RegistroParto {
    @Id
    private String id;
    private String propietario;     // Dueño del registro (multi-tenant)
    
    private String idVaca;          // Carabana de la madre
    private String nombreVaca;      // Nombre de la madre
    private LocalDate fechaParto;   // Día del parto
    
    // Datos del Becerro/Cría
    private String idBecerro;       // Caravana del recién nacido
    private String nombreBecerro;   // Nombre asignado
    private String nombrePapa;      // Nombre del padre
    private String estadoBecerro;   // activa, vendida
    
    // Campos extra útiles para un parto
    private String sexoCria;        // Macho o Hembra
    private String observaciones;   // Ej: "Parto normal", "Distocia", etc.
}
