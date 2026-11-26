package com.sistema.Sistema_ganadero.config;

import com.sistema.Sistema_ganadero.model.Animal;
import com.sistema.Sistema_ganadero.model.RegistroParto;
import com.sistema.Sistema_ganadero.model.RegistroReproductivo;
import com.sistema.Sistema_ganadero.model.ToroCompra;
import com.sistema.Sistema_ganadero.repository.AnimalRepository;
import com.sistema.Sistema_ganadero.repository.RegistroPartoRepository;
import com.sistema.Sistema_ganadero.repository.RegistroReproductivoRepository;
import com.sistema.Sistema_ganadero.repository.ToroCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Script de migración para inicializar datos antiguos en el sistema
 * Multi-Tenant.
 * Se ejecuta automáticamente al arrancar la aplicación.
 */
// @Component
public class DataMigration implements CommandLineRunner {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private RegistroPartoRepository partoRepository;

    @Autowired
    private RegistroReproductivoRepository reproductivoRepository;

    @Autowired
    private ToroCompraRepository toroRepository;

    @Override
    public void run(String... args) throws Exception {
        String defaultOwner = "Rm"; // Usuario administrador por defecto

        System.out.println("--- Iniciando migración de datos Multi-Tenant ---");

        // 1. Migrar Animales
        List<Animal> animales = animalRepository.findAll();
        for (Animal a : animales) {
            if (a.getPropietario() == null || a.getPropietario().isEmpty() || a.getPropietario().equals("admin_pro")) {
                a.setPropietario(defaultOwner);
                animalRepository.save(a);
            }
        }

        // 2. Migrar Partos
        List<RegistroParto> partos = partoRepository.findAll();
        for (RegistroParto p : partos) {
            if (p.getPropietario() == null || p.getPropietario().isEmpty() || p.getPropietario().equals("admin_pro")) {
                p.setPropietario(defaultOwner);
                partoRepository.save(p);
            }
        }

        // 3. Migrar Registros Reproductivos
        List<RegistroReproductivo> repros = reproductivoRepository.findAll();
        for (RegistroReproductivo r : repros) {
            if (r.getPropietario() == null || r.getPropietario().isEmpty() || r.getPropietario().equals("admin_pro")) {
                r.setPropietario(defaultOwner);
                reproductivoRepository.save(r);
            }
        }

        // 4. Migrar Toros
        List<ToroCompra> toros = toroRepository.findAll();
        for (ToroCompra t : toros) {
            if (t.getPropietario() == null || t.getPropietario().isEmpty() || t.getPropietario().equals("admin_pro")) {
                t.setPropietario(defaultOwner);
                toroRepository.save(t);
            }
        }

        System.out.println("--- Migración finalizada ---");
    }
}
