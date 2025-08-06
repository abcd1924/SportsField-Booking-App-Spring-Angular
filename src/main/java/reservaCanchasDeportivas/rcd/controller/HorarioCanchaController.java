package reservaCanchasDeportivas.rcd.controller;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reservaCanchasDeportivas.rcd.model.HorarioCancha;
import reservaCanchasDeportivas.rcd.service.HorarioCanchaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

//TESTEADO CON POSTMAN
//URL: http://localhost:8080/api/horarios-canchas
@RestController
@RequestMapping("/api/horarios-canchas")
public class HorarioCanchaController {
    @Autowired
    private HorarioCanchaService horarioCanchaService;

    @GetMapping()
    public ResponseEntity<List<HorarioCancha>> listarHorarios() {
        List<HorarioCancha> horarios = horarioCanchaService.listarHorarioCanchas();
        return ResponseEntity.ok(horarios);
    }

    @PostMapping("/crear")
    public ResponseEntity<String> crearHorario(@RequestBody HorarioCancha horarioCancha) {
        horarioCanchaService.crearHorarioCancha(horarioCancha);
        return ResponseEntity.status(HttpStatus.CREATED).body("Horaio creado exitosamente");
    }

    @PutMapping("editar/{id}")
    public ResponseEntity<HorarioCancha> actualizarHorario(@PathVariable Long id, @RequestBody HorarioCancha horario){
        HorarioCancha actualizado = horarioCanchaService.actualizarHorarioCancha(id, horario);
        return ResponseEntity.ok(actualizado);
    }

    //Buscar horarios por cancha y día
    @GetMapping("/buscar/cancha-dia")
    public ResponseEntity<List<HorarioCancha>> obtenerHorariosPorCanchaYDia(@RequestParam Long canchaId, @RequestParam String diaSemana){
        List<HorarioCancha> horarios = horarioCanchaService.obtenerPorCanchaYDia(canchaId, diaSemana);
        return ResponseEntity.ok(horarios);
    }

    //Validar disponiblidad de horario
    @GetMapping("/validar-disponibilidad")
    public ResponseEntity<Optional<HorarioCancha>> validarDisponibilidadHorario(@RequestParam Long canchaId, @RequestParam String dia, @RequestParam LocalTime hora){
        Optional<HorarioCancha> horarios = horarioCanchaService.validarDisponibilidadHorario(canchaId, dia, hora);
        if(horarios.isPresent()){
            return ResponseEntity.ok(horarios);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Optional.empty());
        }
    }
}