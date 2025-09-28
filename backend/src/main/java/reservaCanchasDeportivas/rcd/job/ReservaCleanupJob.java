package reservaCanchasDeportivas.rcd.job;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reservaCanchasDeportivas.rcd.model.EstadoReserva;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.repository.ReservaRepository;

@Component
@EnableScheduling
public class ReservaCleanupJob {
    @Autowired
    private ReservaRepository reservaRepository;

    private static final Logger log = LoggerFactory.getLogger(ReservaCleanupJob.class);

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void limpiarReservasExpiradas() {
        log.info("Iniciando limpieza de reservas TEMPORAL expiradas");

        LocalDateTime tiempoLimite = LocalDateTime.now().minus(15, ChronoUnit.MINUTES);

        List<Reserva> reservasExpiradas = reservaRepository.findByEstadoAndFechaCreacionBefore(EstadoReserva.TEMPORAL,
                tiempoLimite);

        for (Reserva reserva : reservasExpiradas) {
            reserva.setEstado(EstadoReserva.EXPIRADA.name());
            reservaRepository.save(reserva);

            log.info("Reserva {} marcada como EXPIRADA", reserva.getId());
        }

        log.info("Limpieza completada. {} reservas procesadas", reservasExpiradas.size());
    }
}