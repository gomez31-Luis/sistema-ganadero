package com.sistema.Sistema_ganadero.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

/**
 * CLASE: ToroCompra
 * PROPÓSITO: Modelo de datos (Entidad) que representa un Toro comprado externamente.
 * Define la estructura de los campos que se guardarán en la colección "toros_compra" de MongoDB.
 */
@Data
@Document(collection = "toros_compra")
public class ToroCompra {
    @Id
    private String id;
    private String propietario;     // Dueño del registro (multi-tenant)
    
    private String idToro;          // ID
    private Double pesoKg;          // Peso en Kg
    private Double precio;          // Precio
    private String estado;          // Activo o Vendido
    private LocalDate fechaCompra;  // Fecha de compra
    private Double kgGanados;       // Kg ganados
    private LocalDate fechaSalida;  // Fecha de salida
}
