package reservaCanchasDeportivas.rcd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;

@Repository
public interface CanchaDeportivaRepository extends JpaRepository<CanchaDeportiva, Long>{
    
    //Métodos personalizados
    CanchaDeportiva findByNumeroCancha(String numeroCancha);

    CanchaDeportiva findByTipoCancha(String numeroCancha);
}
