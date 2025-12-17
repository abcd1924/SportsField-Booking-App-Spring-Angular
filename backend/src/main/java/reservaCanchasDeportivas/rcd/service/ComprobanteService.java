package reservaCanchasDeportivas.rcd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reservaCanchasDeportivas.rcd.model.Comprobante;
import reservaCanchasDeportivas.rcd.model.EstadoReserva;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.repository.ComprobanteRepository;

@Service
public class ComprobanteService {
    @Autowired
    private ComprobanteRepository comprobanteRepository;

    @Autowired
    private ReservaService reservaService;

    public Comprobante generarComprobantePorReservaId(Long reservaId) {
        Optional<Comprobante> comprobanteExistente = comprobanteRepository.findByReservaId(reservaId);
        if (comprobanteExistente.isPresent()) {
            throw new RuntimeException("Ya existe un comprobante para la reserva ID: " + reservaId);
        }

        Reserva reserva = reservaService.obtenerReservasPorId(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + reservaId));

        if (reserva.getEstado() != EstadoReserva.CONFIRMADA) {
            throw new RuntimeException(
                    "La reserva debe estar CONFIRMADA para generar comprobante. Estado actual: " + reserva.getEstado());
        }

        Comprobante comprobante = new Comprobante();
        comprobante.setReserva(reserva);
        comprobante.setFechaEmision(LocalDateTime.now());
        comprobante.setCodigoComprobante(generarCodigoComprobante());

        calcularTotal(comprobante, reserva);

        return comprobanteRepository.save(comprobante);
    }

    private void calcularTotal(Comprobante c, Reserva r) {
        double subtotal = r.getHorasTotales() * r.getCanchaDeportiva().getPrecioPorHora();
        double igv = 0.18 * subtotal;
        double total = subtotal + igv;

        c.setSubtotal(Math.round(subtotal * 100.0) / 100.0);
        c.setIgv(Math.round(igv * 100.0) / 100.0);
        c.setTotal(Math.round(total * 100.0) / 100.0);
    }

    private String generarCodigoComprobante() {
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        long timestamp = System.currentTimeMillis();
        return "CMP-" + uuid + "-" + timestamp;
    }

    public Optional<Comprobante> obtenerPorReservaId(Long reservaId) {
        return comprobanteRepository.findByReservaId(reservaId);
    }

    public List<Comprobante> obtenerComprobantesPorFechaEmisionEntre(LocalDateTime inicio, LocalDateTime fin) {
        return comprobanteRepository.findByFechaEmisionBetween(inicio, fin);
    }

    public List<Comprobante> listarComprobantes() {
        return comprobanteRepository.findAll();
    }

    public Optional<Comprobante> obtenerComprobantePorId(Long id) {
        return comprobanteRepository.findById(id);
    }

    // Método para el dashboard: calcular ingresos totales en un rango de fechas
    public Double calcularIngresosPorRango(LocalDateTime inicio, LocalDateTime fin) {
        return comprobanteRepository.calcularIngresosPorRango(inicio, fin);
    }
}