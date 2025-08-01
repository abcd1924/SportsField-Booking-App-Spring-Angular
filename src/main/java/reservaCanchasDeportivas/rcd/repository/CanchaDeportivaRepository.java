package reservaCanchasDeportivas.rcd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;

@Repository
public interface CanchaDeportivaRepository extends JpaRepository<CanchaDeportiva, Long>{
    
    //Métodos personalizados
    List<CanchaDeportiva> findByNumeroCancha(String numeroCancha);

    List<CanchaDeportiva> findByTipoCancha(String numeroCancha);

    List<CanchaDeportiva> findByEstado(String estado);

}
