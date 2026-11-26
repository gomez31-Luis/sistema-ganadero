package com.sistema.Sistema_ganadero.service;

import com.sistema.Sistema_ganadero.model.Animal;
import com.sistema.Sistema_ganadero.repository.AnimalRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

/**
 * Servicio para manejar la lógica de negocio de los animales.
 */
@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private RegistroReproductivoService reproService;

    @Autowired
    private RegistroPartoService partoService;

    private String getUsernameActual() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public List<Animal> listarTodos() {
        return animalRepository.findByPropietario(getUsernameActual());
    }

    /**
     * Verifica si ya existe un animal con esa caravana.
     */
    public boolean existeCarabana(String carabana) {
        return animalRepository.findByCarabanaAndPropietario(carabana, getUsernameActual()).isPresent();
    }

    public Animal guardar(Animal animal) {
        animal.setPropietario(getUsernameActual());//

        // Si el animal ya existe (es una edición), actualizamos los registros
        // reproductivos
        if (animal.getId() != null && !animal.getId().isEmpty()) {
            Animal viejo = animalRepository.findByIdAndPropietario(animal.getId(), getUsernameActual()).orElse(null);
            if (viejo != null) {
                // Conservar la foto anterior si no se subió una nueva en la edición
                if (animal.getFotoUrl() == null) {
                    animal.setFotoUrl(viejo.getFotoUrl());
                } else if (viejo.getFotoUrl() != null && !viejo.getFotoUrl().equals(animal.getFotoUrl())) {
                    // Si se subió una foto nueva y ya existía una anterior, la eliminamos físicamente
                    try {
                        String uploadDir = System.getProperty("user.dir");
                        java.nio.file.Path oldPath = java.nio.file.Paths.get(uploadDir + viejo.getFotoUrl());
                        java.nio.file.Files.deleteIfExists(oldPath);
                    } catch (Exception e) {
                        System.err.println("Error al borrar foto vieja: " + e.getMessage());
                    }
                }

                // Comparación segura contra nulos
                boolean cambioCarabana = !Objects.equals(viejo.getCarabana(), animal.getCarabana());
                boolean cambioNombre = !Objects.equals(viejo.getNombre(), animal.getNombre());

                if (cambioCarabana || cambioNombre) {
                    reproService.actualizarDatosAnimal(
                            viejo.getCarabana(),
                            animal.getCarabana(),
                            animal.getNombre());

                    // También actualizar partos
                    partoService.actualizarDatosMadre(
                            viejo.getCarabana(),
                            animal.getCarabana(),
                            animal.getNombre());
                }
            }
        }
        return animalRepository.save(animal);
    }

    public void eliminar(String id) {
        // Antes de eliminar de la DB, buscamos el animal para borrar su foto
        animalRepository.findByIdAndPropietario(id, getUsernameActual()).ifPresent(animal -> {
            if (animal.getFotoUrl() != null) {
                try {
                    String uploadDir = System.getProperty("user.dir");
                    java.nio.file.Path photoPath = java.nio.file.Paths.get(uploadDir + animal.getFotoUrl());
                    java.nio.file.Files.deleteIfExists(photoPath);
                } catch (Exception e) {
                    System.err.println("Error al borrar foto al eliminar animal: " + e.getMessage());
                }
            }
        });
        animalRepository.deleteById(id);
    }
}
