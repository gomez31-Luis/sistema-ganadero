package com.sistema.Sistema_ganadero.controller;

import com.sistema.Sistema_ganadero.model.Animal;
import com.sistema.Sistema_ganadero.service.AnimalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.List;

/**
 * Controlador para gestionar las peticiones web de animales.
 */
@Controller
@RequestMapping("/animales")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    /**
     * Devuelve la lista de todos los animales en formato JSON para la tabla.
     */
    @GetMapping("/api/listar")
    @ResponseBody
    public List<Animal> listarAnimales() {
        return animalService.listarTodos();
    }

    /**
     * API para verificar si una caravana ya está registrada.
     */
    @GetMapping("/api/verificar/{carabana}")
    @ResponseBody
    public ResponseEntity<Boolean> verificarCarabana(@PathVariable String carabana) {
        boolean existe = animalService.existeCarabana(carabana);
        return ResponseEntity.ok(existe);
    }

    /**
     * Procesa el guardado o actualización de un animal y su foto.
     */
    @PostMapping("/guardar")
    public String guardarAnimal(@ModelAttribute Animal animal,
            @RequestParam(value = "animalPhoto", required = false) MultipartFile file) {

        // Procesar la imagen si el usuario subió una
        if (file != null && !file.isEmpty()) {
            try {
                // 1. Generar nombre único para evitar que fotos con el mismo nombre se
                // sobrescriban
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

                // 2. Ruta física en el proyecto (carpeta uploads)
                // Esto guardará las fotos en una carpeta llamada "uploads" en la misma carpeta
                // donde esté el .jar
                String uploadDir = System.getProperty("user.dir") + "/uploads/";

                // 3. Crear la carpeta si es la primera vez
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                // 4. Guardar el archivo en el disco duro
                Path filePath = Paths.get(uploadDir, fileName);
                Files.write(filePath, file.getBytes());

                // 5. Asignar la ruta web al objeto animal para guardarlo en MongoDB
                animal.setFotoUrl("/uploads/" + fileName);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        boolean esEdicion = (animal.getId() != null && !animal.getId().isEmpty());
        animalService.guardar(animal);

        if (esEdicion) {
            return "redirect:/ver-individual.html?editado=true";
        }
        return "redirect:/registro-individual.html?exito=true";
    }

    /**
     * Elimina un animal de la base de datos por su ID.
     */
    @DeleteMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<String> eliminarAnimal(@PathVariable String id) {
        animalService.eliminar(id);
        return ResponseEntity.ok("Animal eliminado correctamente");
    }
}
