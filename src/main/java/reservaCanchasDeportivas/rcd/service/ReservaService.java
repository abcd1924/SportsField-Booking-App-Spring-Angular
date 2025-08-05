package reservaCanchasDeportivas.rcd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.repository.ReservaRepository;

@Service
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;

    public Reserva crearReserva(Reserva reserva) {
        if (reservaRepository.existsByCodUnico(reserva.getCodUnico())) {
            throw new IllegalArgumentException("El código único ya está en uso");
        }

        reserva.setEstado("PENDIENTE"); // Estado por defecto al crear
        return reservaRepository.save(reserva);
    }

    public List<Reserva> obtenerReservasPorUsuario(Long usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    public Optional<Reserva> obtenerReservaPorCodigoUnico(String cod_unico) {
        return reservaRepository.findByCodUnico(cod_unico);
    }

    public Optional<Reserva> obtenerReservasPorId(Long id) {
        return reservaRepository.findById(id);
    }

    public void cancelarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        reserva.setEstado("CANCELADA");
        reservaRepository.save(reserva);
    }

    public List<Reserva> buscarReservasFuturasConfirmadas() {
        return reservaRepository.findFutureConfirmedReservations();
    }
}
