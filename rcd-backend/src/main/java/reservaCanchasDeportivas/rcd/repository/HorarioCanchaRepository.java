package reservaCanchasDeportivas.rcd.repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.HorarioCancha;

@Repository
public interface HorarioCanchaRepository extends JpaRepository<HorarioCancha, Long> {

        List<HorarioCancha> findByDisponibleTrue();

        List<HorarioCancha> findByCanchaDeportivaIdAndDiaSemana(Long canchaId, String diaSemana);

        // Buscar un horario específico para validar si existe
        @Query("SELECT h FROM HorarioCancha h WHERE h.canchaDeportiva.id = :canchaId AND h.diaSemana = :dia AND :hora >= h.horaInicio AND :hora < h.horaFin AND UPPER(h.diaSemana) = UPPER(:dia)")
        Optional<HorarioCancha> validarDisponibilidadHorario(
                        @Param("canchaId") Long canchaId,
                        @Param("dia") String dia,
                        @Param("hora") LocalTime hora);

        // Buscar un horario específico para validar si existe (con hora exacta)
        @Query("SELECT h FROM HorarioCancha h WHERE h.canchaDeportiva.id = :canchaId AND h.diaSemana = :dia AND h.horaInicio = :horaInicio")
        Optional<HorarioCancha> validarHorarioExacto(
                        @Param("canchaId") Long canchaId,
                        @Param("dia") String dia,
                        @Param("horaInicio") LocalTime horaInicio);

        // Validar si hay solapamiento de horarios - Crear horario
        @Query("""
                            SELECT h FROM HorarioCancha h
                            WHERE h.canchaDeportiva.id = :canchaId
                            AND h.diaSemana = :diaSemana
                            AND (
                                (h.horaInicio < :horaFin AND h.horaFin > :horaInicio)
                            )
                        """)
        Optional<HorarioCancha> findSolapamientoHorario(@Param("canchaId") Long canchaId,
                        @Param("diaSemana") String diaSemana,
                        @Param("horaInicio") LocalTime horaInicio,
                        @Param("horaFin") LocalTime horaFin);

        // Validar si hay solapamiento de horarios excluyendo id - Actualizar horario
        @Query("""
                            SELECT h FROM HorarioCancha h
                            WHERE h.canchaDeportiva.id = :canchaId
                            AND h.diaSemana = :diaSemana
                            AND h.id <> :id
                            AND (
                                (h.horaInicio < :horaFin AND h.horaFin > :horaInicio)
                            )
                        """)
        Optional<HorarioCancha> findSolapamientoHorarioExcluyendoId(
                        @Param("id") Long id,
                        @Param("canchaId") Long canchaId,
                        @Param("diaSemana") String diaSemana,
                        @Param("horaInicio") LocalTime horaInicio,
                        @Param("horaFin") LocalTime horaFin);

}