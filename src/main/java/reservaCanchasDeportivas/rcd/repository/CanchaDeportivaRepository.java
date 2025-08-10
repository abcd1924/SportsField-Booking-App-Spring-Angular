package reservaCanchasDeportivas.rcd.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;

@Repository
public interface CanchaDeportivaRepository extends JpaRepository<CanchaDeportiva, Long>, JpaSpecificationExecutor<CanchaDeportiva>{
    
    //Métodos personalizados
    List<CanchaDeportiva> findByNumeroCancha(String numeroCancha);

    List<CanchaDeportiva> findByTipoCancha(String tipo_cancha);

    List<CanchaDeportiva> findByEstado(String estado);

    boolean existsByNumeroCancha(String numeroCancha);

    @Query("""
        SELECT c FROM CanchaDeportiva c
        WHERE c.estado = 'ACTIVA'
        AND NOT EXISTS (
            SELECT 1
            FROM Reserva r
            WHERE r.canchaDeportiva = c
            AND (
                (r.fechaInicio < :fechaFin AND r.fechaFin > :fechaInicio))
        )""")
    List<CanchaDeportiva> findCanchasDisponibles(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
}
