package reservaCanchasDeportivas.rcd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.Comprobante;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.repository.ComprobanteRepository;

@Service
public class ComprobanteService {
    @Autowired
    private ComprobanteRepository comprobanteRepository;

    public Comprobante crearComprobante(Reserva reserva){
        Comprobante c = new Comprobante();
        c.setReserva(reserva);
        c.setFechaEmision(LocalDateTime.now());
        //Calcular total
        c.setSubtotal(reserva.getHorasTotales() * reserva.getCanchaDeportiva().getPrecioPorHora());
        c.setIgv(0.18 * c.getSubtotal());
        c.setTotal(c.getSubtotal() + c.getIgv());
        return comprobanteRepository.save(c);
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
