package com.sistema.Sistema_ganadero.controller;

import com.sistema.Sistema_ganadero.model.ToroCompra;
import com.sistema.Sistema_ganadero.service.ToroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.ResponseEntity;
import java.util.List;

/**
 * CLASE: ToroCompraController
 * PROPÓSITO: Controlador REST (y de vistas) para la gestión de Toros de Compra.
 * Se encarga de interceptar las peticiones HTTP del Frontend (como guardar un toro 
 * desde un formulario o pedir la lista de toros en JSON) y pasarlas al Servicio (ToroService).
 */
@Controller
@RequestMapping("/toros")
public class ToroCompraController {

    @Autowired
    private ToroService toroService;

    @PostMapping("/guardar")
    public String guardarToro(ToroCompra toro) {
        toroService.guardarToro(toro);
        return "redirect:/ver-toros.html?exito=true";
    }

    @GetMapping("/todos")
    @ResponseBody
    public List<ToroCompra> listarTodos() {
        return toroService.listarTodos();
    }

    @PostMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<String> eliminarToro(@PathVariable String id) {
        toroService.eliminarToro(id);
        return ResponseEntity.ok("Eliminado");
    }

    @GetMapping("/api/verificar/{idToro}")
    @ResponseBody
    public boolean verificarToro(@PathVariable String idToro) {
        return toroService.existeToro(idToro);
    }
}
