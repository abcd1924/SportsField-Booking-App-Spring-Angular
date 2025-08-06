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
        Long canchaId = horarioCancha.getCanchaDeportiva().getId();
        String dia = horarioCancha.getDiaSemana();
        LocalTime horaInicio = horarioCancha.getHoraInicio();

        Optional<HorarioCancha> horarioExt = horarioCanchaRepository.validarHorarioExacto(canchaId, dia, horaInicio);

        if(horarioExt.isPresent()){
            throw new IllegalArgumentException("Ya existe un horario para la cancha con id " + canchaId + " en el día " + dia + " a la hora " + horaInicio);
        }

        return horarioCanchaRepository.save(horarioCancha);
    }

    public HorarioCancha actualizarHorarioCancha(Long id, HorarioCancha horarioAct) {
        HorarioCancha horarioExistente = horarioCanchaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario con id " + id + " no encontrado"));

        horarioExistente.setDiaSemana(horarioAct.getDiaSemana());
        horarioExistente.setHoraInicio(horarioAct.getHoraInicio());
        horarioExistente.setHoraFin(horarioAct.getHoraFin());
        horarioExistente.setDisponible(horarioAct.isDisponible());
        horarioExistente.setCanchaDeportiva(canchaDeportivaRepository.findById(horarioAct.getCanchaDeportiva().getId())
                .orElseThrow(() -> new IllegalArgumentException("Cancha no encontrada con id " + horarioAct.getCanchaDeportiva().getId())));
        return horarioCanchaRepository.save(horarioExistente);
    }

    public List<HorarioCancha> listarHorarioCanchas() {
        return horarioCanchaRepository.findAll();
    }

    public List<HorarioCancha> obtenerPorCanchaYDia(Long canchaId, String diaSemana) {
        return horarioCanchaRepository.findByCanchaDeportivaIdAndDiaSemana(canchaId, diaSemana);
    }

    public Optional<HorarioCancha> validarDisponibilidadHorario(Long canchaId, String dia, LocalTime hora) {
        return horarioCanchaRepository.validarDisponibilidadHorario(canchaId, dia, hora);
    }
}
