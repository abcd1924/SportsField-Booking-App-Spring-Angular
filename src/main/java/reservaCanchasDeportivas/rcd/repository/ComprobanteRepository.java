package reservaCanchasDeportivas.rcd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.Comprobante;

@Repository
public interface ComprobanteRepository extends JpaRepository<Comprobante, Long>{
    Optional<Comprobante> findByReservaId(Long reservaId);

}
