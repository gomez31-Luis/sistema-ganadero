package com.sistema.Sistema_ganadero.service;

import com.sistema.Sistema_ganadero.model.RegistroReproductivo;
import com.sistema.Sistema_ganadero.repository.RegistroReproductivoRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDate;


/**
 * Servicio para manejar la lógica de los registros reproductivos.
 */
@Service
public class RegistroReproductivoService {

    @Autowired
    private RegistroReproductivoRepository repository;

    private String getUsernameActual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public List<RegistroReproductivo> listarTodos() {
        return repository.findByPropietario(getUsernameActual());
    }

    public RegistroReproductivo guardar(RegistroReproductivo registro) {
        registro.setPropietario(getUsernameActual());
        
        // Lógica de Negocio: Calcular fecha de parto automáticamente
        // Regla: Fecha de Inseminación + 9 meses + 10 días
        if (registro.getFechaInseminacion() != null) {
            LocalDate fechaPartoCalculada = registro.getFechaInseminacion()
                    .plusMonths(9)
                    .plusDays(10);
            registro.setFechaParto(fechaPartoCalculada);
        }
        
        return repository.save(registro);
    }


    public void eliminar(String id) {
        repository.deleteById(id);
    }

    /**
     * Actualiza el ID y Nombre en todos los registros reproductivos de un animal específico.
     * Se usa cuando se edita el animal en el inventario individual.
     */
    public void actualizarDatosAnimal(String idVacaViejo, String idVacaNuevo, String nombreNuevo) {
        List<RegistroReproductivo> registros = repository.findByIdVacaAndPropietario(idVacaViejo, getUsernameActual());
        for (RegistroReproductivo reg : registros) {
            reg.setIdVaca(idVacaNuevo);
            reg.setNombreVaca(nombreNuevo);
            repository.save(reg);
        }
    }
}

