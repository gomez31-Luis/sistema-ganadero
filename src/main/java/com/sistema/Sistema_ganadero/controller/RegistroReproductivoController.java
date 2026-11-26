package com.sistema.Sistema_ganadero.controller;

import com.sistema.Sistema_ganadero.model.RegistroReproductivo;
import com.sistema.Sistema_ganadero.service.RegistroReproductivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

/**
 * Controlador para las operaciones de registro reproductivo.
 */
@Controller
@RequestMapping("/reproduccion")
public class RegistroReproductivoController {

    @Autowired
    private RegistroReproductivoService reproService;

    /**
     * API para listar todos los registros en formato JSON.
     */
    @GetMapping("/api/listar")
    @ResponseBody
    public List<RegistroReproductivo> listar() {
        return reproService.listarTodos();
    }

    /**
     * Guarda un nuevo registro reproductivo desde el formulario.
     */
    @PostMapping("/guardar")
    public String guardar(@ModelAttribute RegistroReproductivo registro) {
        reproService.guardar(registro);
        return "redirect:/registro-reproductivo.html?exito=true";
    }

    /**
     * API para eliminar un registro.
     */
    @DeleteMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        reproService.eliminar(id);
        return ResponseEntity.ok("Registro eliminado");
    }
}
