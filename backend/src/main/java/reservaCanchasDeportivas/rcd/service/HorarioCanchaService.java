package reservaCanchasDeportivas.rcd.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reservaCanchasDeportivas.rcd.model.HorarioCancha;
import reservaCanchasDeportivas.rcd.repository.CanchaDeportivaRepository;
import reservaCanchasDeportivas.rcd.repository.HorarioCanchaRepository;
import reservaCanchasDeportivas.rcd.repository.ReservaRepository;

@Service
public class HorarioCanchaService {
    @Autowired
    private HorarioCanchaRepository horarioCanchaRepository;

    @Autowired
    private CanchaDeportivaRepository canchaDeportivaRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    public HorarioCancha crearHorarioCancha(HorarioCancha horarioCancha) {
        Long canchaId = horarioCancha.getCanchaDeportiva().getId();
        String dia = horarioCancha.getDiaSemana();
        LocalTime horaInicio = horarioCancha.getHoraInicio();
        LocalTime horaFin = horarioCancha.getHoraFin();

        Optional<HorarioCancha> horarioExt = horarioCanchaRepository.validarHorarioExacto(canchaId, dia, horaInicio);
        Optional<HorarioCancha> horarioSolapado = horarioCanchaRepository.findSolapamientoHorario(canchaId, dia,
                horaInicio, horaFin);

        if (horarioExt.isPresent()) {
            throw new IllegalArgumentException("Ya existe un horario para la cancha con id " + canchaId + " en el día "
                    + dia + " a la hora " + horaInicio);
        }

        if (horarioSolapado.isPresent()) {
            throw new IllegalArgumentException(
                    "El horario se solapa con otro existente para la cancha con id " + canchaId);
        }

        return horarioCanchaRepository.save(horarioCancha);
    }

    public HorarioCancha actualizarHorarioCancha(Long id, HorarioCancha horarioAct) {
        Long canchaId = horarioAct.getCanchaDeportiva().getId();
        String dia = horarioAct.getDiaSemana();
        LocalTime horaInicio = horarioAct.getHoraInicio();
        LocalTime horaFin = horarioAct.getHoraFin();

        HorarioCancha horarioExistente = horarioCanchaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Horario con id " + id + " no encontrado"));

        Optional<HorarioCancha> horarioSolapada = horarioCanchaRepository.findSolapamientoHorarioExcluyendoId(id,
                canchaId, dia, horaInicio, horaFin);

        System.out.println("Solapamiento encontrado: " + horarioSolapada.isPresent());

        if (horarioSolapada.isPresent()) {
            throw new IllegalArgumentException(
                    "El horario se solapa con otro existente para la cancha con id " + canchaId);
        }

        horarioExistente.setDiaSemana(horarioAct.getDiaSemana());
        horarioExistente.setHoraInicio(horarioAct.getHoraInicio());
        horarioExistente.setHoraFin(horarioAct.getHoraFin());
        horarioExistente.setDisponible(horarioAct.isDisponible());
        horarioExistente.setCanchaDeportiva(canchaDeportivaRepository.findById(horarioAct.getCanchaDeportiva().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Cancha no encontrada con id " + horarioAct.getCanchaDeportiva().getId())));
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

    public boolean validarDisponibilidad(Long canchaId, LocalDate fecha, LocalTime hora, int duracioHoras) {
        //Verificar si existe un horario configurado para esa fecha/hora
        String diaSemana = fecha.getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.forLanguageTag("es"))
                .toLowerCase(); // Ej: "lunes", "martes", etc.

        boolean existeHorario = horarioCanchaRepository
                .validarDisponibilidadHorario(canchaId, diaSemana, hora)
                .isPresent();

                System.out.println("Dia recibido: " + diaSemana);

        if (!existeHorario) {
            // No hay horario registrado, no se puede reservar
            return false;
        }

        //Verificar si ya hay una reserva que se solape con ese rango
        LocalDateTime fechaHoraInicio = LocalDateTime.of(fecha, hora);
        LocalDateTime fechaHoraFin = fechaHoraInicio.plusHours(duracioHoras);

        boolean hayReserva = reservaRepository
                .existeReservaEnHorario(canchaId, fechaHoraInicio, fechaHoraFin);

        return !hayReserva; // Devuelve true solo si NO hay reserva
    }

    public void eliminar(Long id) {
        HorarioCancha horarioCancha = horarioCanchaRepository.findById(id)
            .orElseThrow(()-> new RuntimeException("No se puede eliminar. No se encontró horario con ID: " +id));
        
            horarioCanchaRepository.deleteById(id);
    }

    // Método para obtener todos los horarios de una cancha específica
    public List<HorarioCancha> obtenerHorariosPorCancha(Long canchaId) {
        return horarioCanchaRepository.findByCanchaDeportivaId(canchaId);
    }

    // Método para obtener solo horarios disponibles
    public List<HorarioCancha> obtenerHorariosDisponibles(Long canchaId) {
        return horarioCanchaRepository.findByCanchaDeportivaIdAndDisponibleTrue(canchaId);
    }
}