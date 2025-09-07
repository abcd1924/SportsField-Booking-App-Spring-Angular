package reservaCanchasDeportivas.rcd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.Comprobante;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.repository.ComprobanteRepository;

@Service
public class ComprobanteService {
    @Autowired
    private ComprobanteRepository comprobanteRepository;

    @Autowired
    private ReservaService reservaService;

    public Comprobante crearComprobante(Reserva reserva){
        Reserva reservaCompleta = reservaService.obtenerReservasPorId(reserva.getId())
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada para generar comprobante"));

        Comprobante c = new Comprobante();
        c.setReserva(reservaCompleta);
        c.setFechaEmision(LocalDateTime.now());
        c.setCodigoComprobante(generarCodigoComprobante());
        
        //Calcular total
        calcularTotal(c, reservaCompleta);
        
        return comprobanteRepository.save(c);
    }

    private void calcularTotal(Comprobante c, Reserva r){
        double subtotal = r.getHorasTotales() * r.getCanchaDeportiva().getPrecioPorHora();
        double igv = 0.18 * subtotal;
        double total = subtotal + igv;

        c.setSubtotal(subtotal);
        c.setIgv(igv);
        c.setTotal(total);
    }

    private String generarCodigoComprobante(){
        return "CMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() + "-" + System.currentTimeMillis();
    }

    public Optional<Comprobante> obtenerPorReservaId(Long reservaId){
        return comprobanteRepository.findByReservaId(reservaId);
    }

    public List<Comprobante> obtenerComprobantesPorFechaEmisionEntre(LocalDateTime inicio, LocalDateTime fin){
        return comprobanteRepository.findByFechaEmisionBetween(inicio, fin);
    }

    public List<Comprobante> listarComprobantes(){
        return comprobanteRepository.findAll();
    }
}