package reservaCanchasDeportivas.rcd.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reservaCanchasDeportivas.rcd.DTO.ReservaDTO;
import reservaCanchasDeportivas.rcd.errors.HorarioNoDisponibleException;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.service.ReservaService;

//TESTEADO CON POSTMAN
//URL: http://localhost:8080/api/reservas
@RestController
@RequestMapping("/api/reservas")
public class ReservaController {
    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public ResponseEntity<List<Reserva>> listarReservas() {
        List<Reserva> reservas = reservaService.listarReservas();
        return ResponseEntity.ok(reservas);
    }

    @PostMapping("/crear-temporal")
    public ResponseEntity<?> crearReservaTemporal(@RequestBody ReservaDTO reservaDTO) {
        try {
            Reserva reserva = reservaService.crearReservaTemporal(reservaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
        } catch (HorarioNoDisponibleException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error", "HORARIO_NO_DISPONIBLE",
                            "mensaje", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "ERROR_CREACION",
                            "mensaje", e.getMessage()));
        }
    }

    // Confirmar reserva por ID
    @PutMapping("/confirmar/{id}")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Long id) {
        try {
            Reserva confirmada = reservaService.confirmarReserva(id);
            return ResponseEntity.ok(confirmada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Cancelar reserva por ID
    @PutMapping("/cancelar/{id}")
    public ResponseEntity<Reserva> cancelarReserva(@PathVariable Long id) {
        try {
            Reserva cancelada = reservaService.cancelarReserva(id);
            return ResponseEntity.ok(cancelada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Obtener reservas por usuario
    @GetMapping("/buscar/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerReservaPorUsuario(@PathVariable Long usuarioId) {
        List<Reserva> reservas = reservaService.obtenerReservasPorUsuario(usuarioId);
        return ResponseEntity.ok(reservas);
    }

    // Obtener reserva por código único
    @GetMapping("/buscar/codUnico/{codUnico}")
    public ResponseEntity<Reserva> obtenerReservaPorCodigoUnico(@PathVariable String codUnico) {
        Optional<Reserva> reserva = reservaService.obtenerReservaPorCodigoUnico(codUnico);
        if (reserva.isPresent()) {
            return ResponseEntity.ok(reserva.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener reserva por ID
    @GetMapping("/buscar/id/{id}")
    public ResponseEntity<Reserva> obtenerReservasPorId(@PathVariable Long id) {
        Optional<Reserva> reserva = reservaService.obtenerReservasPorId(id);
        if (reserva.isPresent()) {
            return ResponseEntity.ok(reserva.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}