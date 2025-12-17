package reservaCanchasDeportivas.rcd.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.Comprobante;

@Repository
public interface ComprobanteRepository extends JpaRepository<Comprobante, Long> {
    Optional<Comprobante> findByReservaId(Long reservaId);

    // Buscar todos los comprobantes emitidos en una fecha específica
    List<Comprobante> findByFechaEmisionBetween(LocalDateTime inicio, LocalDateTime fin);

    // Calcular ingresos totales en un rango de fechas para el dashboard
    @Query("SELECT COALESCE(SUM(c.total), 0.0) FROM Comprobante c WHERE c.fechaEmision BETWEEN :inicio AND :fin")
    Double calcularIngresosPorRango(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
