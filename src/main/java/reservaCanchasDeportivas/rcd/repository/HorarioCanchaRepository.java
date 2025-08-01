package reservaCanchasDeportivas.rcd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.HorarioCancha;

@Repository
public interface HorarioCanchaRepository extends JpaRepository<HorarioCancha, Long>{

    List<HorarioCancha> findByDisponibleTrue();
    List<HorarioCancha> findByCanchaIdAndDia_semana(Long canchaId, String diaSemana);
}
