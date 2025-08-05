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
public interface HorarioCanchaRepository extends JpaRepository<HorarioCancha, Long>{

    List<HorarioCancha> findByDisponibleTrue();
    List<HorarioCancha> findByCanchaDeportivaIdAndDiaSemana(Long canchaId, String diaSemana);

    //Buscar un horario específico para validar si existe
    @Query("SELECT h FROM HorarioCancha h WHERE h.canchaDeportiva.id =: canchaDeportivaId AND h.diaSemana =:dia AND h.horaInicio =:hora AND h.horaFin =:hora")
    Optional<HorarioCancha> validarDisponibilidadHorario(@Param("canchaDeportivaId") Long canchaDeportivaId, @Param("dia") String dia, @Param("hora") LocalTime hora);
}