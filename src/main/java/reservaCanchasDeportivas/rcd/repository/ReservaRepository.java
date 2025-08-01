package reservaCanchasDeportivas.rcd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.Reserva;
import java.util.List;


@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long>{

    Optional<Reserva> findByCod_unico(String cod_unico);
    List<Reserva> findByUsuarioId(Long usuario);
    List<Reserva> findByEstado(String estado);

}
