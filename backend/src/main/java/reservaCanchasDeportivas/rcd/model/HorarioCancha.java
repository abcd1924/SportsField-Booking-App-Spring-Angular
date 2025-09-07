package reservaCanchasDeportivas.rcd.model;

import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "horarios_canchas")
public class HorarioCancha {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String diaSemana;

    @Column(nullable = false)
    private LocalTime horaInicio;

    @Column(nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false)
    private boolean disponible;

    @ManyToOne
    @JoinColumn(name = "canchaDeportivaId", nullable = false)
    private CanchaDeportiva canchaDeportiva;

    // Constructor
    public HorarioCancha() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public CanchaDeportiva getCanchaDeportiva() {
        return canchaDeportiva;
    }

    public void setCanchaDeportiva(CanchaDeportiva canchaDeportiva) {
        this.canchaDeportiva = canchaDeportiva;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }
}
