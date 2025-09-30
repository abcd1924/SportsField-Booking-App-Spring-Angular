package reservaCanchasDeportivas.rcd.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reservaCanchasDeportivas.rcd.model.EstadoReserva;
import reservaCanchasDeportivas.rcd.model.Reserva;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    Optional<Reserva> findByCodUnico(String codUnico);

    List<Reserva> findByUsuarioId(Long usuario);

    List<Reserva> findByEstado(EstadoReserva estado);

    boolean existsByCodUnico(String cod_unico);

    List<Reserva> findByEstadoAndFechaCreacionReservaBefore(EstadoReserva estado, LocalDateTime fechaLimite);

    // Buscar reservas activas para una cancha en una fecha determinada (evita
    // solapamientos)
    @Query("SELECT r FROM Reserva r WHERE r.canchaDeportiva.id = :canchaId AND r.fechaCreacionReserva =:fechaHora and r.estado = EstadoReserva.CANCELADA")
    List<Reserva> findByCanchaIdAndFechaHoraAndEstadoReserva(@Param("canchaId") Long canchaId,
            @Param("fechaHora") LocalDateTime fechaHora);

    // Buscar reservas futuras confirmadas (para reportes o frontend)
    @Query("SELECT r FROM Reserva r WHERE r.fechaCreacionReserva > CURRENT_TIMESTAMP AND r.estado = EstadoReserva.CONFIRMADA")
    List<Reserva> findFutureConfirmedReservations();

    // Verificar si existe una reserva en un horario específico para una cancha - usado en HorarioCanchaService
    @Query("""
                SELECT COUNT(r) > 0 FROM Reserva r
                WHERE r.canchaDeportiva.id = :canchaId
                AND (
                    (r.fechaInicio < :fechaHoraFin AND r.fechaFin > :fechaHoraInicio)
                )
            """)
    boolean existeReservaEnHorario(
            @Param("canchaId") Long canchaId,
            @Param("fechaHoraInicio") LocalDateTime fechaHoraInicio,
            @Param("fechaHoraFin") LocalDateTime fechaHoraFin);
}
