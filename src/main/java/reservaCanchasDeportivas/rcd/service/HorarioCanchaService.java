package reservaCanchasDeportivas.rcd.service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.HorarioCancha;
import reservaCanchasDeportivas.rcd.repository.CanchaDeportivaRepository;
import reservaCanchasDeportivas.rcd.repository.HorarioCanchaRepository;

@Service
public class HorarioCanchaService {
    @Autowired
    private HorarioCanchaRepository horarioCanchaRepository;

    @Autowired
    private CanchaDeportivaRepository canchaDeportivaRepository;

    public HorarioCancha crearHorarioCancha(HorarioCancha horarioCancha) {
        if (horarioCanchaRepository.existsById(horarioCancha.getId())) {
            throw new IllegalArgumentException("EL horario ya existe con este ID");
        }

        return horarioCanchaRepository.save(horarioCancha);
    }

    public HorarioCancha actualizarHorarioCancha(Long id, HorarioCancha horarioAct) {
        HorarioCancha horarioExistente = horarioCanchaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario con id " + id + " no encontrado"));

        horarioExistente.setDia_semana(horarioAct.getDia_semana());
        horarioExistente.setHora_inicio(horarioAct.getHora_inicio());
        horarioExistente.setHora_fin(horarioAct.getHora_fin());
        horarioExistente.setDisponible(horarioAct.isDisponible());
        horarioExistente.setCanchaDeportiva(canchaDeportivaRepository.findById(horarioAct.getCanchaDeportiva().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada con id " + horarioAct.getCanchaDeportiva().getId())));
        return horarioCanchaRepository.save(horarioExistente);
    }

    List<HorarioCancha> listarHorarioCanchas() {
        return horarioCanchaRepository.findAll();
    }

    List<HorarioCancha> obtenerPorCanchaYDia(Long canchaId, String diaSemana) {
        return horarioCanchaRepository.findByCanchaIdAndDia_semana(canchaId, diaSemana);
    }

    Optional<HorarioCancha> validarDisponibilidadHorario(Long canchaId, String dia, LocalTime hora) {
        return horarioCanchaRepository.validarDisponibilidadHorario(canchaId, dia, hora);
    }
}
