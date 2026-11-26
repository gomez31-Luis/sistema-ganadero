package com.sistema.Sistema_ganadero.service;

import com.sistema.Sistema_ganadero.model.RegistroParto;
import com.sistema.Sistema_ganadero.repository.RegistroPartoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RegistroPartoService {

    @Autowired
    private RegistroPartoRepository repository;

    private String getUsernameActual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public List<RegistroParto> listarTodos() {
        return repository.findByPropietario(getUsernameActual());
    }

    public RegistroParto guardar(RegistroParto parto) {
        parto.setPropietario(getUsernameActual());
        return repository.save(parto);
    }

    public void eliminar(String id) {
        repository.deleteById(id);
    }

    public List<RegistroParto> buscarPorMadre(String idVaca) {
        return repository.findByIdVacaAndPropietario(idVaca, getUsernameActual());
    }

    public void actualizarDatosMadre(String idVacaViejo, String idVacaNuevo, String nombreNuevo) {
        List<RegistroParto> partos = repository.findByIdVacaAndPropietario(idVacaViejo, getUsernameActual());
        for (RegistroParto parto : partos) {
            parto.setIdVaca(idVacaNuevo);
            parto.setNombreVaca(nombreNuevo);
            repository.save(parto);
        }
    }
}
