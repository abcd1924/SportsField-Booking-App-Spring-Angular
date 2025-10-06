package reservaCanchasDeportivas.rcd.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
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



        // Verificar si existe una reserva en un horario específico para una cancha -
        // usado en HorarioCanchaService
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

        /*
         * Verifica si existe una reserva que solape con el rango de tiempo dado
         * Estados considerados: TEMPORAL y CONFIRMADA
         * 
         * Lógica de solapamiento:
         * - La reserva existente termina DESPUÉS de que empiece la nueva (fechaFin >
         * fechaInicioNueva)
         * - Y la reserva existente empieza ANTES de que termine la nueva (fechaInicio <
         * fechaFinNueva)
         */
        @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reserva r " +
                        "WHERE r.canchaDeportiva.id = :canchaId " +
                        "AND r.fechaInicio < :fechaFin " +
                        "AND r.fechaFin > :fechaInicio " +
                        "AND r.estado IN ('TEMPORAL', 'CONFIRMADA')")
        boolean existeReservaEnRango(
                        @Param("canchaId") Long canchaId,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT r FROM Reserva r " +
                        "WHERE r.canchaDeportiva.id = :canchaId " +
                        "AND r.fechaInicio < :fechaFin " +
                        "AND r.fechaFin > :fechaInicio " +
                        "AND r.estado IN (:estados)")
        List<Reserva> findReservasEnRango(
                        @Param("canchaId") Long canchaId,
                        @Param("fechaInicio") LocalDateTime fechaInicio,
                        @Param("fechaFin") LocalDateTime fechaFin,
                        @Param("estados") List<EstadoReserva> estados);

}