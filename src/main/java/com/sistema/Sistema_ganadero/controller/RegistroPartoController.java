package com.sistema.Sistema_ganadero.controller;

import com.sistema.Sistema_ganadero.model.RegistroParto;
import com.sistema.Sistema_ganadero.service.RegistroPartoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@Controller
@RequestMapping("/partos")
public class RegistroPartoController {

    @Autowired
    private RegistroPartoService partoService;

    @GetMapping("/api/listar")
    @ResponseBody
    public List<RegistroParto> listar() {
        return partoService.listarTodos();
    }

    @GetMapping("/api/madre/{idVaca}")
    @ResponseBody
    public List<RegistroParto> listarPorMadre(@PathVariable String idVaca) {
        return partoService.buscarPorMadre(idVaca);
    }

    @PostMapping("/guardar")
    public String guardar(@ModelAttribute RegistroParto parto) {
        boolean esEdicion = (parto.getId() != null && !parto.getId().isEmpty());
        partoService.guardar(parto);
        
        if (esEdicion) {
            return "redirect:/ver-partos.html?editado=true";
        }
        return "redirect:/registro-parto.html?exito=true";
    }

    @DeleteMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<String> eliminar(@PathVariable String id) {
        partoService.eliminar(id);
        return ResponseEntity.ok("Registro eliminado");
    }
}
