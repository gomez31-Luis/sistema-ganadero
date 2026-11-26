package com.sistema.Sistema_ganadero.repository;

import com.sistema.Sistema_ganadero.model.RegistroReproductivo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

/**
 * Repositorio para la gestión de registros reproductivos.
 */
public interface RegistroReproductivoRepository extends MongoRepository<RegistroReproductivo, String> {
    // Permite buscar todos los eventos de una vaca específica por su caravana
    List<RegistroReproductivo> findByIdVaca(String idVaca);
    
    List<RegistroReproductivo> findByPropietario(String propietario);
    List<RegistroReproductivo> findByIdVacaAndPropietario(String idVaca, String propietario);
}
