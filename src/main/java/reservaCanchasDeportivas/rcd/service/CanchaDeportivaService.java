package reservaCanchasDeportivas.rcd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;
import reservaCanchasDeportivas.rcd.repository.CanchaDeportivaRepository;

@Service
public class CanchaDeportivaService {
    @Autowired
    private CanchaDeportivaRepository canchaDeportivaRepository;

    public CanchaDeportiva crearCanchaDeportiva(CanchaDeportiva cancha){
        if(canchaDeportivaRepository.existsById(cancha.getId())){
            throw new IllegalArgumentException("La cancha ya existe con este ID");
        }

        return canchaDeportivaRepository.save(cancha);
    }

    public CanchaDeportiva actualizarCanchaDeportiva(Long id, CanchaDeportiva canchaAct){
        CanchaDeportiva canchaExistente = canchaDeportivaRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Cancha con id " + id + " no encontrada"));

        canchaExistente.setTipo_cancha(canchaAct.getTipo_cancha());
        canchaExistente.setNumero_cancha(canchaAct.getNumero_cancha());
        canchaExistente.setPrecio_por_hora(canchaAct.getPrecio_por_hora());
        canchaExistente.setCapacidad_jugadores(canchaAct.getCapacidad_jugadores());
        canchaExistente.setTipo_grass(canchaAct.getTipo_grass());
        canchaExistente.setDescripcion(canchaAct.getDescripcion());
        canchaExistente.setEstado(canchaAct.getEstado());
        canchaExistente.setIluminacion(canchaAct.getIluminacion());

        return canchaDeportivaRepository.save(canchaExistente);
    }

    List<CanchaDeportiva> listarCanchasDeportivas(){
        return canchaDeportivaRepository.findAll();
    }

    List<CanchaDeportiva> buscarPorTipoCancha(String tipoCancha){
        return canchaDeportivaRepository.findByTipoCancha(tipoCancha);
    }

    List<CanchaDeportiva> buscarPorNumeroCancha(String numCancha){
        return canchaDeportivaRepository.findByNumeroCancha(numCancha);
    }

    List<CanchaDeportiva> listarCanchasDisponibles(){
        return canchaDeportivaRepository.findByEstado("ACTIVA");
    }

    Optional<CanchaDeportiva> obtenerCanchaPorId(Long id){
        return canchaDeportivaRepository.findById(id);
    }
}
