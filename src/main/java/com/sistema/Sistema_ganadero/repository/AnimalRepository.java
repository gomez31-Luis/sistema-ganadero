package com.sistema.Sistema_ganadero.repository;

import com.sistema.Sistema_ganadero.model.Animal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

/**
 * Repositorio para la gestión de animales en MongoDB.
 */
public interface AnimalRepository extends MongoRepository<Animal, String> {
    List<Animal> findByPropietario(String propietario);
    
    // Permite buscar un animal por su código de caravana y propietario
    Optional<Animal> findByCarabanaAndPropietario(String carabana, String propietario);
    
    Optional<Animal> findByIdAndPropietario(String id, String propietario);
}
