package reservaCanchasDeportivas.rcd.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import reservaCanchasDeportivas.rcd.model.Comprobante;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.service.ComprobanteService;

//TESTEADO CON POSTMAN
//URL: http://localhost:8080/api/comprobantes
@RestController
@RequestMapping("/api/comprobantes")
public class ComprobanteController {
    @Autowired
    private ComprobanteService comprobanteService;

    @GetMapping
    public ResponseEntity<List<Comprobante>> listarComprobantes(){
        List<Comprobante> comprobantes = comprobanteService.listarComprobantes();
        return ResponseEntity.ok(comprobantes);
    }

    @PostMapping("/crear")
    public ResponseEntity<String>crearComprobante(@RequestBody Reserva reserva){
        comprobanteService.crearComprobante(reserva);
        return ResponseEntity.status(HttpStatus.CREATED).body("Comprobante creado con éxito");
    }

    //Buscar comprobante por reservaId
    @GetMapping("/buscar/reservaId/{reservaId}")
    public ResponseEntity<Optional<Comprobante>> obtenerComprobantePorReservaId(@PathVariable Long reservaId){
        Optional<Comprobante> comprobante = comprobanteService.obtenerPorReservaId(reservaId);
        if(comprobante.isPresent()){
            return ResponseEntity.ok(comprobante);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Optional.empty());
        }
    }

    //Buscar comprobantes por rango de fechas
    @GetMapping("/buscar/fechaEmisionEntre")
    public ResponseEntity<List<Comprobante>> obtenerComprobantesPorFechaEmisionEntre(@RequestParam LocalDateTime inicio, @RequestParam LocalDateTime fin){
        List<Comprobante> comprobantes = comprobanteService.obtenerComprobantesPorFechaEmisionEntre(inicio, fin);
        return ResponseEntity.ok(comprobantes);
    }    
}
