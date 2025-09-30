package reservaCanchasDeportivas.rcd.service;

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.EstadoReserva;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.repository.ReservaRepository;

@Service
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;

    public Reserva crearReservaTemporal(Reserva reserva) {
        String codigo;
        do {
            codigo = generarCodigoUnico();
        } while (reservaRepository.existsByCodUnico(codigo));

        reserva.setCodUnico(codigo);
        reserva.setEstado(EstadoReserva.TEMPORAL);

        if(reserva.getFechaFin().isBefore(reserva.getFechaInicio())){
            throw new IllegalArgumentException("La fecha de fin debe ser posterior a la fecha de inicio");
        }
        long horas = Duration.between(reserva.getFechaInicio(), reserva.getFechaFin()).toHours();
        reserva.setHorasTotales((int) horas);

        return reservaRepository.save(reserva);
    }

    public List<Reserva> listarReservas(){
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

    public List<Reserva> buscarReservasFuturasConfirmadas() {
        return reservaRepository.findFutureConfirmedReservations();
    }

    public Reserva confirmarReserva(Long id){
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        reserva.setEstado(EstadoReserva.CONFIRMADA);
        return reservaRepository.save(reserva);
    }

    public String generarCodigoUnico(){
        return "RCD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis();
    }
}