package com.sistema.Sistema_ganadero.service;

import com.sistema.Sistema_ganadero.model.ToroCompra;
import com.sistema.Sistema_ganadero.repository.ToroCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@Service
public class ToroService {

    @Autowired
    private ToroCompraRepository repository;

    private String getUsernameActual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public void guardarToro(ToroCompra toro) {
        toro.setPropietario(getUsernameActual());
        repository.save(toro);
    }

    public List<ToroCompra> listarTodos() {
        return repository.findByPropietario(getUsernameActual());
    }

    public void eliminarToro(String id) {
        // Podríamos verificar si le pertenece antes de borrar, pero dejémoslo simple
        repository.deleteById(id);
    }

    public boolean existeToro(String idToro) {
        return repository.existsByIdToroAndPropietario(idToro, getUsernameActual());
    }
}
