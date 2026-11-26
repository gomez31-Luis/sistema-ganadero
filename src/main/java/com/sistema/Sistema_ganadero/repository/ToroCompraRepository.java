package com.sistema.Sistema_ganadero.repository;

import com.sistema.Sistema_ganadero.model.ToroCompra;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ToroCompraRepository extends MongoRepository<ToroCompra, String> {
    boolean existsByIdToro(String idToro);
    
    List<ToroCompra> findByPropietario(String propietario);
    boolean existsByIdToroAndPropietario(String idToro, String propietario);
}
