package reservaCanchasDeportivas.rcd.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservaCanchasDeportivas.rcd.DTO.ReservaDTO;
import reservaCanchasDeportivas.rcd.errors.HorarioNoDisponibleException;
import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;
import reservaCanchasDeportivas.rcd.model.EstadoReserva;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.repository.ReservaRepository;

@Service
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private CanchaDeportivaService canchaDeportivaService;

    @Autowired
    private UsuarioService usuarioService;

    @Transactional
    public Reserva crearReservaTemporal(ReservaDTO reservaDTO) {

        List<EstadoReserva> estadosOcupados = Arrays.asList(
                EstadoReserva.TEMPORAL,
                EstadoReserva.CONFIRMADA);

        List<Reserva> reservasConflicto = reservaRepository.findReservasEnRango(reservaDTO.getCanchaDeportivaId(),
                reservaDTO.getFechaInicio(), reservaDTO.getFechaFin(), estadosOcupados);

        if (!reservasConflicto.isEmpty()) {
            throw new HorarioNoDisponibleException(
                    "Este horario ya ha sido reservado. Por favor seleccione otro horario.");
        }

        CanchaDeportiva cancha = canchaDeportivaService.obtenerCanchaPorId(reservaDTO.getCanchaDeportivaId())
                .orElseThrow(() -> new RuntimeException("Cancha no encontrada"));

        Usuario usuario = usuarioService.buscarPorId(reservaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String codigo;
        do {
            codigo = generarCodigoUnico();
        } while (reservaRepository.existsByCodUnico(codigo));

        if (reservaDTO.getFechaFin().isBefore(reservaDTO.getFechaInicio())) {
            throw new IllegalArgumentException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        Reserva reserva = new Reserva();
        reserva.setCodUnico(codigo);
        reserva.setEstado(EstadoReserva.TEMPORAL);
        reserva.setFechaInicio(reservaDTO.getFechaInicio());
        reserva.setFechaFin(reservaDTO.getFechaFin());
        long horas = Duration.between(reserva.getFechaInicio(), reserva.getFechaFin()).toHours();
        reserva.setHorasTotales((int) horas);
        reserva.setCanchaDeportiva(cancha);
        reserva.setUsuario(usuario);

        return reservaRepository.save(reserva);
    }

    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }

    public List<Reserva> obtenerReservasPorUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Reserva> obtenerReservaPorCodigoUnico(String codUnico) {
        return reservaRepository.findByCodUnico(codUnico);
    }

    public Optional<Reserva> obtenerReservasPorId(Long id) {
        return reservaRepository.findById(id);
    }

    public Reserva cancelarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        reserva.setEstado(EstadoReserva.CANCELADA);
        return reservaRepository.save(reserva);
    }

    public Reserva confirmarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        return reservaRepository.save(reserva);
    }

    // Método para el dashboard: contar reservas en un rango de fechas
    public Long contarReservasPorRango(LocalDateTime inicio, LocalDateTime fin) {
        return reservaRepository.countByFechaInicioBetween(inicio, fin);
    }

    public String generarCodigoUnico() {
        return "RCD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis();
    }
}