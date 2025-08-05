package reservaCanchasDeportivas.rcd.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código no puede estar vacío")
    @Column(nullable = false, unique = true)
    private String codUnico;

    @Column(nullable = false)
    private int horasTotales;

    @NotBlank(message = "Escoga un estado")
    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private LocalDateTime fechaCreacionReserva = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    @Column(nullable = false)
    private LocalDateTime fechaFin;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "cancha_deportiva_id", nullable = false)
    private CanchaDeportiva canchaDeportiva;

    //Constructor
    public Reserva() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public CanchaDeportiva getCanchaDeportiva() {
        return canchaDeportiva;
    }

    public void setCanchaDeportiva(CanchaDeportiva canchaDeportiva) {
        this.canchaDeportiva = canchaDeportiva;
    }

    public String getCodUnico() {
        return codUnico;
    }

    public void setCodUnico(String codUnico) {
        this.codUnico = codUnico;
    }

    public int getHorasTotales() {
        return horasTotales;
    }

    public void setHorasTotales(int horasTotales) {
        this.horasTotales = horasTotales;
    }

    public LocalDateTime getFechaCreacionReserva() {
        return fechaCreacionReserva;
    }

    public void setFechaCreacionReserva(LocalDateTime fechaCreacionReserva) {
        this.fechaCreacionReserva = fechaCreacionReserva;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }    
}
