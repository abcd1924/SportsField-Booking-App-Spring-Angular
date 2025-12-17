package reservaCanchasDeportivas.rcd.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByNumDocumento(String numDocumento);

    // Contar usuarios nuevos en un rango de fechas para el dashboard
    Long countByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);

}
