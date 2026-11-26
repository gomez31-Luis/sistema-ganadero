package com.sistema.Sistema_ganadero.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

/**
 * Representa un evento reproductivo de un animal.
 * Se guarda en la colección "registros_reproductivos".
 */
@Data
@Document(collection = "registros_reproductivos")
public class RegistroReproductivo {
    @Id
    private String id;
    private String propietario;     // Dueño del registro (multi-tenant)
    private String idVaca;          // Carabana del animal
    private String nombreVaca;
    private LocalDate fechaCelo;
    private LocalDate fechaInseminacion;
    private String toroSemen;
    private LocalDate fechaParto;   // Fecha prevista o real de parto
}
