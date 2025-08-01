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
    List<HorarioCancha> findByCanchaIdAndDia_semana(Long canchaId, String diaSemana);

    //Buscar un horario específico para validar si existe
    @Query("SELECT h FROM HorarioCancha h WHERE h.canchaDeportiva.id AND h.dia_semana =:dia AND h.hora_inicio =:hora AND h.hora_fin =:hora")
    Optional<HorarioCancha> validarDisponibilidadHorario(@Param("canchaId") Long canchaId, @Param("dia") String dia, @Param("hora") LocalTime hora);
}