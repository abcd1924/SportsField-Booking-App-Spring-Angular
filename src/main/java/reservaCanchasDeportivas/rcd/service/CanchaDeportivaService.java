package reservaCanchasDeportivas.rcd.service;

import java.time.LocalDateTime;
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

    public CanchaDeportiva crearCanchaDeportiva(CanchaDeportiva cancha) {
        if (canchaDeportivaRepository.existsByNumeroCancha(cancha.getNumeroCancha())) {
            throw new IllegalArgumentException("La cancha ya existe con este numero");
        }

        return canchaDeportivaRepository.save(cancha);
    }

    public CanchaDeportiva actualizarCanchaDeportiva(Long id, CanchaDeportiva canchaAct) {
        CanchaDeportiva canchaExistente = canchaDeportivaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cancha con id " + id + " no encontrada"));
        
        if(!canchaExistente.getNumeroCancha().equals(canchaAct.getNumeroCancha()) && canchaDeportivaRepository.existsByNumeroCancha(canchaAct.getNumeroCancha())){
            throw new IllegalArgumentException("Ya existe una cancha con el número " +canchaAct.getNumeroCancha());
        }

        canchaExistente.setTipoCancha(canchaAct.getTipoCancha());
        canchaExistente.setNumeroCancha(canchaAct.getNumeroCancha());
        canchaExistente.setPrecioPorHora(canchaAct.getPrecioPorHora());
        canchaExistente.setCapacidadJugadores(canchaAct.getCapacidadJugadores());
        canchaExistente.setTipoGrass(canchaAct.getTipoGrass());
        canchaExistente.setDescripcion(canchaAct.getDescripcion());
        canchaExistente.setEstado(canchaAct.getEstado());
        canchaExistente.setIluminacion(canchaAct.getIluminacion());

        return canchaDeportivaRepository.save(canchaExistente);
    }

    public List<CanchaDeportiva> listarCanchasDeportivas() {
        return canchaDeportivaRepository.findAll();
    }

    public List<CanchaDeportiva> buscarPorTipo_Cancha(String tipo_Cancha) {
        return canchaDeportivaRepository.findByTipoCancha(tipo_Cancha);
    }

    public List<CanchaDeportiva> buscarPorNumero_Cancha(String numeroCancha) {
        return canchaDeportivaRepository.findByNumeroCancha(numeroCancha);
    }

    public List<CanchaDeportiva> listarCanchasDisponibles() {
        return canchaDeportivaRepository.findByEstado("ACTIVA");
    }

    public Optional<CanchaDeportiva> obtenerCanchaPorId(Long id) {
        return canchaDeportivaRepository.findById(id);
    }

    public List<CanchaDeportiva> buscarCanchasDisponibles(LocalDateTime fechaInicio, LocalDateTime fechaFin){
        return canchaDeportivaRepository.findCanchasDisponibles(fechaInicio, fechaFin);
    }

    public void eliminar(Long id) {
        CanchaDeportiva canchaDeportiva = canchaDeportivaRepository.findById(id)
            .orElseThrow(
                () -> new RuntimeException("No se puede eliminar. No se encontró cancha con ID: " +id));
        
        canchaDeportivaRepository.deleteById(id);
    }
}