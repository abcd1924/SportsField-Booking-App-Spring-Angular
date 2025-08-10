package reservaCanchasDeportivas.rcd.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;
import reservaCanchasDeportivas.rcd.service.CanchaDeportivaService;

//TESTEADO CON POSTMAN
//URL: http://localhost:8080/api/canchas-deportivas
@RestController
@RequestMapping("/api/canchas-deportivas")
public class CanchaDeportivaController {

    @Autowired
    private CanchaDeportivaService canchaDeportivaService;

    @GetMapping
    public ResponseEntity<List<CanchaDeportiva>> listarCanchasDeportivas() {
        List<CanchaDeportiva> cancha = canchaDeportivaService.listarCanchasDeportivas();
        return ResponseEntity.ok(cancha);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<CanchaDeportiva> actualizarCanchaDeportiva(@PathVariable Long id,
            @RequestBody CanchaDeportiva canchaAct) {
        CanchaDeportiva actualizada = canchaDeportivaService.actualizarCanchaDeportiva(id, canchaAct);
        return ResponseEntity.ok(actualizada);

    }

    @PostMapping("/crear")
    public ResponseEntity<String> crearCanchaDeportiva(@RequestBody CanchaDeportiva cancha) {
        canchaDeportivaService.crearCanchaDeportiva(cancha);
        return ResponseEntity.status(HttpStatus.CREATED).body("Cancha creada exitosamente");
    }

    // Listar canchas disponibles (estado = ACTIVA)
    @GetMapping("/activas")
    public ResponseEntity<List<CanchaDeportiva>> listarCanchasDisponibles() {
        List<CanchaDeportiva> canchasActivas = canchaDeportivaService.listarCanchasDisponibles();
        return ResponseEntity.ok(canchasActivas);
    }

    // Buscar cancha por tipo
    @GetMapping("/buscar/tipo/{tipoCancha}")
    public ResponseEntity<List<CanchaDeportiva>> buscarCanchaPorTipo(@PathVariable String tipoCancha) {
        List<CanchaDeportiva> canchas = canchaDeportivaService.buscarPorTipo_Cancha(tipoCancha);
        return ResponseEntity.ok(canchas);
    }

    // Buscar cancha por número
    @GetMapping("/buscar/numero/{numeroCancha}")
    public ResponseEntity<List<CanchaDeportiva>> buscarPorCanchaPorNumero(@PathVariable String numeroCancha) {
        List<CanchaDeportiva> canchas = canchaDeportivaService.buscarPorNumero_Cancha(numeroCancha);
        return ResponseEntity.ok(canchas);
    }

    // Buscar cancha por id
    @GetMapping("/buscar/{id}")
    public ResponseEntity<Optional<CanchaDeportiva>> obtenerCanchaPorId(@PathVariable Long id) {
        Optional<CanchaDeportiva> cancha = canchaDeportivaService.obtenerCanchaPorId(id);
        if (cancha.isPresent()) {
            return ResponseEntity.ok(cancha);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Optional.empty());
        }
    }

    // Búsqueda avanzada - Filtrar canchas por tipo, precio, capacidad, iluminación y estado
    @GetMapping("/buscar-avanzado")
    public ResponseEntity<List<CanchaDeportiva>> buscarCanchaAvanzado(
            @RequestParam(required = false) String tipoCancha,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(required = false) Integer capacidadMin,
            @RequestParam(required = false) String iluminacion,
            @RequestParam(required = false) String estado) {
        List<CanchaDeportiva> canchas = canchaDeportivaService.buscarAvanzado(tipoCancha, precioMin, precioMax,
                capacidadMin, iluminacion, estado);
        return ResponseEntity.ok(canchas);
    }

    // Buscar canchas disponibles en un rango de fechas y horas
    @GetMapping("/disponibles")
    public ResponseEntity<List<CanchaDeportiva>> buscarCanchasDisponibles(@RequestParam("fechaInicio") @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<CanchaDeportiva> disponibles = canchaDeportivaService.buscarCanchasDisponibles(fechaInicio, fechaFin);
        return ResponseEntity.ok(disponibles);
    }
}