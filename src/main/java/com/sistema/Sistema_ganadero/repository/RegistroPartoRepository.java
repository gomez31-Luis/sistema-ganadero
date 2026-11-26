package com.sistema.Sistema_ganadero.repository;

import com.sistema.Sistema_ganadero.model.RegistroParto;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RegistroPartoRepository extends MongoRepository<RegistroParto, String> {
    List<RegistroParto> findByIdVaca(String idVaca);
    List<RegistroParto> findByPropietario(String propietario);
    List<RegistroParto> findByIdVacaAndPropietario(String idVaca, String propietario);
}
